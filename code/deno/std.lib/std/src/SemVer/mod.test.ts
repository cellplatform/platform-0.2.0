import { Assert, Semver } from '../mod.ts';

Deno.test('Semver', async (test) => {
  await test.step('eql', () => {
    const a = Semver.parse('1.2.0');
    const b = Semver.parse('1.2.1');
    Assert.eql(Semver.greaterThan(b, a), true);
  });
});
