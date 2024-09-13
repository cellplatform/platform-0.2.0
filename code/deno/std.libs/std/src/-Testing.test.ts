import { Expect } from './mod.ts';

Deno.test('Testing', async (test) => {
  await test.step('Expect.eql', () => {
    Expect.eql(123, 123);
  });
});
