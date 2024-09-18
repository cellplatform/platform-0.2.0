import { Cmd } from './u.ts';

const sh = Cmd.sh({}).run;

await sh('deno task test');
await sh('deno task dry');
await sh('deno task info');
