import { describe, it, expect, t } from './test';
import { Pkg } from './index.pkg.mjs';

describe('module', () => {
  it('Pkg', () => {
    expect(typeof Pkg.name).to.eql('string');
  });
});
