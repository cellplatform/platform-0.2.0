import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { parseArguments } from './u.ts';

Deno.test('parseArguments should correctly parse CLI arguments', () => {
  const args = parseArguments(['-h', '--name', 'Andy', '--color', 'blue', '--save']);

  assertEquals(args, {
    _: [],
    help: true,
    h: true,
    name: 'Andy',
    n: 'Andy',
    color: 'blue',
    c: 'blue',
    save: true,
    s: true,
    '--': [],
  });
});
