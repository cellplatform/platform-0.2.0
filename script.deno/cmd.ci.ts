import { Cmd } from './u.ts';

const sh = Cmd.sh().run;

console.info();
await sh('deno task dry');
await sh('deno task test');
await sh('deno task info');
