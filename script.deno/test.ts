import { Cmd } from '@sys/std-server';

const run = (path: string, args = '') => Cmd.sh(`cd ${path}`, `deno test ${args}`);

/**
 * Run all tests across the mono-repo.
 */

// Std Libs
await run('code/deno/std.lib/std', '-RW');
await run('code/deno/std.lib/std.server', '-RW');

// Drivers.
await run('code/deno/driver/driver.deno.cloud', '-RW');
