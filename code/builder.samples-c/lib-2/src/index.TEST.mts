import { expect } from 'chai';
import { Lib1 } from 'lib-1c';
import { Foo } from 'lib-1';

describe('suite', () => {
  it('does', () => {
    expect(Lib1.foo).to.equal(123);
    console.log('Lib1', Lib1);
    console.log('Foo', Foo);
  });
});
