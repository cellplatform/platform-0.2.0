import { describe, expect, it, Pkg } from './test/index.mjs';

describe('main', () => {
  it('temp 🐷', () => {
    expect(Pkg.version.length).to.greaterThan(0);
  });
});
