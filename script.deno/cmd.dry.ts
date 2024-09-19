import { c, Cmd, Log, type CmdResult } from './u.ts';

const results: CmdResult[] = [];
const run = async (path: string) => {
  const output = await Cmd.sh(path).run(`deno publish --allow-dirty --dry-run`);
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
const title = `Code Check ${c.gray('(publish --dry-run)')}`;
const success = Log.output(results, { title, pad: true });
// if (!success) throw new Error('Checks/Dry-Run Failed');
