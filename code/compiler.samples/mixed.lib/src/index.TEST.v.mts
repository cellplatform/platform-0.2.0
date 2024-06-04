import { describe, expect, it, Pkg } from './test';

describe('main', () => {
  it('temp 🐷', () => {
    expect(Pkg.version.length).to.greaterThan(0);
  });
});
