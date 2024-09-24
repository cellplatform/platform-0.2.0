import { Builder, LogTable, R, Time, Util, fs, ora, pc, type t } from './common';

type Milliseconds = number;

const parseError = (err?: string): t.VitestResultsData | undefined => {
  const error = err ?? '';
  const text = error.substring(error.indexOf('\n'));
  try {
    return text ? (JSON.parse(text) as t.VitestResultsData) : undefined;
  } catch (error) {
    return undefined;
  }
};

/**
 * Run
 */
type Pkg = { name: string; version: string };
const pkg = (await fs.readJSON(fs.resolve('./package.json'))) as Pkg;
const timer = Time.timer();

const filter = (path: string) => {
  if (path.includes('/code/compiler.samples/')) return false;
  if (path.includes('/code/spikes/')) return false;
  if (path.includes('/code/sys.driver/ext.lib.automerge')) return false; // TEMP 🐷
  return true;
};
let paths = await Builder.Find.projectDirs({ filter, sortBy: 'Alpha' });

if (paths.length === 0) {
  console.warn(pc.yellow('No module paths to test'));
  process.exit(1);
}

// Log module list.
console.info(' ');
console.info(pc.cyan('Test list:'));
paths.forEach((path) => console.info(pc.gray(` • ${Util.formatPath(path)}`)));
console.info(' ');

type S = t.TestStats['tests'];
type R = { path: string; elapsed: Milliseconds; error?: string; stats?: S };
const results: R[] = [];
const pushResult = (
  path: string,
  elapsed: Milliseconds,
  options: { error?: string; stats?: S } = {},
) => {
  const { error, stats } = options;
  results.push({ path, elapsed, stats, error });
};

const runTests = async (path: string, options: { silent?: boolean } = {}) => {
  const { silent } = options;
  const timer = Time.timer();
  try {
    const res = await Builder.test(path, {
      run: true,
      reporter: 'json',
      silentTestConsole: true,
      silent,
    });
    const stats = res.stats?.tests;
    pushResult(path, timer.elapsed.msec, { stats });
  } catch (err: any) {
    const error = err.message;
    const obj = parseError(error);
    const stats: S = {
      total: obj?.numTotalTests ?? 0,
      passed: obj?.numPassedTests ?? 0,
      failed: obj?.numFailedTests ?? 0,
      pending: obj?.numPendingTests ?? 0,
      todo: obj?.numTodoTests ?? 0,
    };
    pushResult(path, timer.elapsed.msec, { error, stats });
  }
};

const runInParallel = async (args: { paths: string[]; batch?: number }) => {
  const { paths, batch = 5 } = args;
  const spinner = ora({ indent: 1 });
  const batches = R.splitEvery(batch, paths);

  console.info(pc.gray(`Running across ${batches.length} batches...`));
  console.info(' ');

  for (const batch of batches) {
    batch.forEach((path) => console.info(pc.gray(` ${pc.cyan('•')} ${Util.formatPath(path)}`)));
    spinner.start();

    const wait = Promise.all(batch.map((path) => runTests(path, { silent: true })));
    await wait;
    spinner.stop();
    console.info(' ');
  }

  const failed = results.filter((item) => Boolean(item.error));
  failed.forEach((item) => {
    const obj = parseError(item.error);
    if (obj) {
      const base = fs.resolve('.');
      const { numFailedTests: totalFailed, numTotalTests: total } = obj;

      const summary = pc.yellow(`${pc.yellow(totalFailed)} of ${total} tests failed`);
      console.info(pc.yellow(`${pc.bold('Failed:')} ${Util.formatPath(item.path)} (${summary})`));

      obj.testResults.forEach((item) => {
        const { assertionResults } = item;
        const filename = item.name.substring(base.length + 1);

        if (item.message) console.info(pc.magenta(item.message), '\n');

        assertionResults
          .filter((item) => item.status === 'failed')
          .forEach((item, i) => {
            const { location } = item;
            const line = location?.line ?? 'line-<unknown>';
            const column = location?.column ?? 'column-<unknown>';

            const testAncestors = `${item.ancestorTitles.filter(Boolean).join(' → ').trim()}`;
            const testTitle = `${testAncestors} → ${pc.red(item.title.trim())}`;
            const address = `${filename}:${line}:${column}`;
            const detail = `|→ ${pc.red(`failure in:`)} ${testTitle}`;

            console.info(pc.yellow(pc.dim(`    (${i + 1}) ${address}`)));
            console.info(pc.yellow(pc.dim(`        ${detail}`)));
            item.failureMessages.forEach((item) => {
              const failure = `|→ ${pc.red('message:')}    ${item}`;
              console.info(pc.yellow(pc.dim(`        ${failure}`)));
            });

            console.info(' ');
          });
      });
    }
  });
};

await runInParallel({ paths, batch: 5 });

const failed = results.filter((item) => (item.stats?.total === 0 ? false : Boolean(item.error)));
const ok = failed.length === 0;

const statusColor = (ok: boolean, text: string) => (ok ? pc.green(text) : pc.red(text));
const pathOK = (path: string) => !failed.some((error) => error.path === path);
const icon = (path: string) => {
  const ok = pathOK(path);
  const char = ok ? '✓' : '×';
  return pc.bold(statusColor(ok, char));
};

const table = LogTable();
for (const result of results) {
  const { path, stats } = result;
  const noTests = stats?.total === 0;

  const column = {
    path: pc.gray(` ${noTests ? '-' : icon(path)} ${Util.formatPath(path)}`),
    time: pc.gray(`  ${Time.duration(result.elapsed).toString()} `),
    status: '',
  };

  if (stats && stats.total > 0) {
    const { total, passed, failed, pending } = stats;
    const add = (text: string) => {
      if (column.status) column.status += pc.dim(pc.gray(` | `));
      column.status += text;
    };

    if (failed > 0) add(pc.red(`${failed} failed`));
    add(pc.green(`${passed} passed`));
    if (pending > 0) add(pc.yellow(`${pending} skipped`));
    column.status = ` ${column.status}`;
    if (failed > 0 || pending > 0) column.status += pc.gray(` (${total})`);
  }

  if (stats?.total === 0) {
    column.status = pc.gray(` ${pc.dim('(no tests)')}`);
  }

  table.push([column.path, column.time, column.status]);
}

const totalTests = results.reduce((acc, next) => acc + (next.stats?.total ?? 0), 0);
const totalTestsDisplay = pc.white(pc.bold(`${totalTests.toLocaleString()} tests`));
const totalTimeDisplay = pc.white(pc.bold(timer.elapsed.toString()));

console.info();
console.info(pc.bold(statusColor(ok, ok ? `Success` : `Unsuccessful`)));
console.info(table.toString());
console.info();
console.info(pc.gray(`${totalTestsDisplay} run in ${totalTimeDisplay}`));
console.info(pc.gray(`platform/builder ${pc.cyan(`v${pkg.version}`)}`));

if (!ok) process.exit(1);
