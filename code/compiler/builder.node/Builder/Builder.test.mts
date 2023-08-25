import { execa, type t } from '../common/index.mjs';

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
  const res = await execa(cmd, args, { cwd, stdio: silent ? 'pipe' : 'inherit' });

  const { exitCode, stdout } = res;
  const ok = exitCode === 0;
  const stats = reporter === 'json' ? parseStats(stdout) : undefined;

  return { ok, exitCode, cmd, args, stats };
}

/**
 * Helpers
 */

function parseStats(json: string): t.TestStats {
  const data = JSON.parse(json);

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
}
