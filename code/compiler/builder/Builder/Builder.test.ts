import { JsonUtil, execa, pc, type t } from '../common';

/**
 * Execute unit-tests within the target module directory.
 */
export async function test(
  dir: t.DirString,
  options: {
    filter?: string[];
    watch?: boolean;
    run?: boolean;
    ui?: boolean;
    coverage?: boolean;
    reporter?: 'default' | 'verbose' | 'json' | 'dot' | 'junit';
    silentTestConsole?: boolean; // NB: silence console output from tests
    silent?: boolean;
  } = {},
) {
  const {
    watch = true,
    coverage = false,
    ui = false,
    run = false,
    reporter,
    silentTestConsole: testConsoleSilent = false, // Output from console
    silent = false,
  } = options;

  const pkg = await JsonUtil.Pkg.load(dir);
  const scripts = pkg.scripts ?? {};
  const hasTestScript = Boolean(scripts.test);

  // Filters.
  const args: string[] = [];
  (options.filter ?? []).forEach((filter) => args.push(filter));

  // Options.
  args.push(`--watch=${watch}`);
  args.push('--passWithNoTests');
  if (ui) args.push('--ui');
  if (testConsoleSilent) args.push('--silent');
  if (coverage) args.push('--coverage');
  if (run) args.push('--run');
  if (reporter) args.push(`--reporter=${reporter}`);

  const cmd = `vitest`;
  const cwd = dir;
  let exitCode = 0;
  let stdout = '';

  if (hasTestScript) {
    const res = await execa(cmd, args, { cwd, stdio: silent ? 'pipe' : 'inherit' });
    exitCode = res.exitCode;
    stdout = res.stdout;
  }

  let ok = exitCode === 0;
  const stats = reporter === 'json' ? parseStats(stdout) : undefined;
  if (stats?.success === false || stats?.error) ok = false;
  return {
    ok,
    exitCode,
    cmd,
    cwd,
    args,
    stats,
  } as const;
}

/**
 * Helpers
 */
function parseStats(json: string): t.TestStats | undefined {
  let lines = json.split('\n');
  const index = lines.findIndex((line) => line === '{');
  if (index < 0) return;

  try {
    const data = JSON.parse(lines.slice(index).join('\n'));
    return {
      success: data.success,
      suites: {
        total: data.numTotalTestSuites,
        passed: data.numPassedTestSuites,
        failed: data.numFailedTestSuites,
        pending: data.numPendingTestSuites,
      },
      tests: {
        total: data.numTotalTests,
        passed: data.numPassedTests,
        failed: data.numFailedTests,
        pending: data.numPendingTests,
        todo: data.numTodoTests,
      },
    };
  } catch (error: any) {
    const CHARS = 500;
    console.info(pc.red('Failed while parsing JSON returned from vitest.'), error.message);
    console.info(pc.gray(`First ${pc.white(CHARS)} characters of failed json input:`));
    console.info(pc.gray('-'.repeat(80)));
    console.info(pc.yellow(json.substring(0, 500)));
    console.info(pc.gray('-'.repeat(80)));
    return {
      success: false,
      suites: { total: -1, passed: -1, failed: -1, pending: -1 },
      tests: { total: -1, passed: -1, failed: -1, pending: -1, todo: -1 },
      error: error.message,
    };
  }
}
