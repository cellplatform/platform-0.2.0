import { Cmd, Log, type CmdResult } from './u.ts';

/**
 * Run the linter across the mono-repo.
 */
const results: CmdResult[] = [];
const run = async (path: string, args = '') => {
  const output = await Cmd.sh({ silent: true, path }).run(`deno lint ${args}`);
  results.push({ output, path });
};

// Std Libs.
await run('code/deno/std.lib/std');
await run('code/deno/std.lib/std.s');

// Drivers.
await run('code/deno/driver/driver.deno.cloud');

/**
 * Output.
 */
const success = Log.output(results, { title: 'Lint', pad: true });
if (!success) throw new Error('Lint Failed');
