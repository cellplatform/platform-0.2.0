import { expect } from 'chai';
import { Lib1 } from 'lib-1c';

describe('suite', () => {
  it('does', () => {
    expect(Lib1.foo).to.equal(123);
  });
});
