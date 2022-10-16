import { execa, t } from '../common/index.mjs';

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
  const res = await execa(cmd, args, { cwd, stdio: silent ? 'ignore' : 'inherit' });
  const ok = res.exitCode === 0;

  return { ok, cmd, args };
}
