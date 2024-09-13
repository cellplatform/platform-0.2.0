import { Cmd } from '@sys/stdlib-server';

await Cmd.sh('cd code/deno/std.lib', 'deno test -RW');
await Cmd.sh('cd code/deno/std.lib.server', 'deno test -RW');
