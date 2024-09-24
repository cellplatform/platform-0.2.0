import { Cmd, Log, type CmdResult } from './u.ts';

/**
 * Run the linter across the mono-repo.
 */
const results: CmdResult[] = [];
const run = async (path: string) => {
  const output = await Cmd.sh({ silent: true, path }).run(`deno lint`);
  results.push({ output, path });
};

// Std Libs.
await run('code/deno/sys/std');
await run('code/deno/sys/std-s');

// Drivers.
await run('code/deno/driver/driver-deno-cloud');
await run('code/deno/driver/driver-automerge');

/**
 * Output.
 */
const success = Log.output(results, { title: 'Lint', pad: true });
if (!success) throw new Error('Lint Failed');
