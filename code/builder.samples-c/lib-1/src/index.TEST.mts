import { expect } from 'chai';
import { Lib1 } from './index.mjs';

describe('suite', () => {
  it('does', () => {
    expect(Lib1.foo).to.equal(123);
  });
});
