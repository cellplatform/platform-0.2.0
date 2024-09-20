import { describe, expect, it } from './mod.ts';

describe('foo', () => {
  describe('bar', () => {
    it('does thing', () => {
      expect(123).to.eql(123);
    });
  });
});

Deno.test('Deno.test: sample', async (test) => {
  await test.step('eql', () => {
    expect(123).to.eql(123);
  });
});
