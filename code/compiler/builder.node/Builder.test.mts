import { execa, t } from './common/index.mjs';
import Vitest from 'vitest';

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
    silentTestConsole?: boolean; // NB: silence console output from tests
    reporter?: 'default' | 'verbose' | 'json' | 'dot' | 'junit';
  } = {},
) {
  const {
    watch = true,
    coverage = false,
    ui = false,
    silentTestConsole: testConsoleSilent = false, // Output from console
    run = false,
    reporter,
  } = options;
  const args = [];

  // Filters.
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
  const res = await execa(cmd, args, { cwd, stdio: 'inherit' });
  const ok = res.exitCode === 0;

  return { ok, cmd, args };
}
