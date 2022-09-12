import { describe, expect, it, Pkg } from './TEST/index.mjs';

describe('main', () => {
  it('tmp', () => {
    expect(Pkg.version.length).to.greaterThan(0);
  });
});
