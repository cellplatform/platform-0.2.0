import { Cmd, Log, type CmdResult } from './u.ts';

/**
 * Run all tests across the mono-repo.
 */
const results: CmdResult[] = [];
const run = async (path: string, args = '') => {
  const output = await Cmd.sh({ silent: true, path }).run(`deno test ${args}`);
  results.push({ output, path });
};

// Std Libs.
// await run('code/deno/std.lib/std', '-RWN');
// await run('code/deno/std.lib/std.s', '-RWN --allow-run');

// Drivers.
await run('code/deno/driver/driver.deno.cloud', '-RWN -v');
/**
 * TODO 🐷 FIX ↑ make work in CI on github. Secrets/ENV_VARS issue.
 */

/**
 * Output.
 */
const success = Log.output(results, { title: 'Tests', pad: true });
if (!success) throw new Error('Tests Failed');
