import { expect } from './mod.ts';

Deno.test('Expect', async (test) => {
  await test.step('eql', () => {
    expect(123).to.eql(123);
  });
});
