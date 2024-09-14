import { Assert } from './mod.ts';

Deno.test('Assert', async (test) => {
  await test.step('Assert.eql', () => {
    Assert.eql(123, 123);
  });
});
