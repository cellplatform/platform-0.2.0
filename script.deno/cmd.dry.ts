import { Cmd } from '@sys/std-s';
import { Log, type CmdOutput } from './u.ts';

const results: CmdOutput[] = [];
const run = async (path: string) => {
  const output = await Cmd.sh({ silent: true }).run(
    `cd ${path}`,
    `deno publish --allow-dirty --dry-run`,
  );
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
const success = Log.output(results, { title: 'Publish (--dry-run)', pad: true });
if (!success) Deno.exit(1);
