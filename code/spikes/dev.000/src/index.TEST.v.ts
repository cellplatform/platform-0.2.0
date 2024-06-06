import { describe, it, expect, type t } from './test';
import { Pkg } from './index.pkg';

describe('module', () => {
  it('Pkg', () => {
    expect(typeof Pkg.name).to.eql('string');
  });
});
