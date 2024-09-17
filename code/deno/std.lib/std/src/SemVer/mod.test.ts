import { describe, expect, it, Semver } from '../mod.ts';

describe('Semver', () => {
  it('Semver.parse', () => {
    const a = Semver.parse('1.2.0');
    const b = Semver.parse('1.2.1');
    expect(Semver.greaterThan(b, a)).to.eql(true);
  });
});
