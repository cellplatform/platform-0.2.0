import { Expect } from './common.ts';

Deno.test('🐷', async (test) => {
  await test.step('sample', () => {
    Expect.eql(123, 123);
  });
});
