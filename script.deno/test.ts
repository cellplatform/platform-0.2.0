import { Cmd } from '@sys/stdlib';

await Cmd.sh('cd code/deno', 'deno test -RW');
