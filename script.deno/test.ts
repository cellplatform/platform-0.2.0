import { Cmd } from '@sys/std-server';

await Cmd.sh('cd code/deno/std', 'deno test -RW');
await Cmd.sh('cd code/deno/std.server', 'deno test -RW');
