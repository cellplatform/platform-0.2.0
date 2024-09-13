import { Cmd } from '@sys/std-server';

/**
 * Run all tests across the mono-repo.
 */
await Cmd.sh('cd code/deno/std', 'deno test -RW');
await Cmd.sh('cd code/deno/std.server', 'deno test -RW');
