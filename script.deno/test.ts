import { Cmd } from './u.ts';

await Cmd.sh('cd code/deno', 'deno test -RW --quiet');
