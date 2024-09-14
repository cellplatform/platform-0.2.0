import { Assert } from './common.ts';

Deno.test('🐷', async (test) => {
  await test.step('sample', () => {
    Assert.eql(123, 123);
  });
});
