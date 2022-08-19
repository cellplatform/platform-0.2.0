import { expect } from 'chai';
import { Lib1 } from 'lib-1b';

describe('suite', () => {
  it('does', () => {
    expect(Lib1.foo).to.equal(123);
  });
});
