import { execa, t } from './common/index.mjs';

/**
 * Execute unit-tests within the target module directory.
 */
export async function test(
  dir: t.PathString,
  options: {
    watch?: boolean;
    run?: boolean;
    ui?: boolean;
    coverage?: boolean;
    silent?: boolean;
  } = {},
) {
  const { watch = true, coverage = false, ui = false, silent = false, run = false } = options;

  const args = [`--watch=${watch}`];
  if (ui) args.push('--ui');
  if (silent) args.push('--silent');
  if (coverage) args.push('--coverage');
  if (run) args.push('--run');

  const cmd = 'vitest';
  const res = await execa(cmd, args, { cwd: dir, stdio: 'inherit' });
  const ok = res.exitCode === 0;

  return { ok, cmd, args };
}
