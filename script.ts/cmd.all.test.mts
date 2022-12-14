#!/usr/bin/env ts-node
import { Builder, fs, pc, Util, LogTable, Time, R, ora } from './common/index.mjs';

type Milliseconds = number;

/**
 * Run
 */
type Pkg = { name: string; version: string };
const pkg = (await fs.readJSON(fs.resolve('./package.json'))) as Pkg;

const timer = Time.timer();

const filter = (path: string) => {
  if (path.includes('/code/compiler.samples/')) return false;
  if (path.includes('/code/spikes/')) return false;
  return true;
};
let paths = await Builder.Find.projectDirs({ filter, sortBy: 'Alpha' });

if (paths.length === 0) {
  console.warn(pc.yellow('no paths'));
  process.exit(1);
}

// Log module list.
console.info(' ');
console.info(pc.green('test list:'));
paths.forEach((path) => console.info(pc.gray(` • ${Util.formatPath(path)}`)));
console.info(' ');

type R = { path: string; elapsed: Milliseconds; error?: string };
const results: R[] = [];
const pushResult = (path: string, elapsed: Milliseconds, options: { error?: string } = {}) => {
  const { error } = options;
  results.push({ path, elapsed, error });
};

const runTests = async (path: string, options: { silent?: boolean } = {}) => {
  const { silent } = options;
  const timer = Time.timer();
  try {
    await Builder.test(path, {
      run: true,
      silentTestConsole: true,
      silent,
    });
    pushResult(path, timer.elapsed.msec);
  } catch (err: any) {
    const error = err.message;
    pushResult(path, timer.elapsed.msec, { error });
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
    console.log(' ');
  }

  const failed = results.filter((item) => Boolean(item.error));
  failed.forEach((item) => {
    console.info(pc.yellow(`Failed: ${Util.formatPath(item.path)}`));
    console.info(pc.gray(item.error));
    console.info(` `);
  });
};

await runInParallel({ paths, batch: 5 });

const failed = results.filter((item) => Boolean(item.error));
const ok = failed.length === 0;

const statusColor = (ok: boolean, text: string) => (ok ? pc.green(text) : pc.red(text));
const pathOK = (path: string) => !failed.some((error) => error.path === path);
const bullet = (path: string) => statusColor(pathOK(path), '●');

const table = LogTable();
for (const result of results) {
  const { path } = result;

  const column = {
    path: pc.gray(` ${bullet(path)} ${Util.formatPath(path)}`),
    time: pc.gray(`  ${Time.duration(result.elapsed).toString()} `),
  };

  table.push([column.path, column.time]);
}

console.info();
console.info(statusColor(ok, ok ? 'all tests passed' : 'some tests failured'));
console.info(table.toString());
console.info();
console.info(pc.gray(`elapsed ${timer.elapsed.toString()}`));
console.info(pc.gray(`platform/builder ${pc.cyan(`v${pkg.version}`)}`));

if (!ok) process.exit(1);
