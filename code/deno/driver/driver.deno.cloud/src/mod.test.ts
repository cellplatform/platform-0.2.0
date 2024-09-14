import { expect } from './common.ts';

Deno.test('🐷', async (test) => {
  await test.step('sample', () => {
    expect(123).to.eql(123);
  });
});
