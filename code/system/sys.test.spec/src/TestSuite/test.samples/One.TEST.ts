import { expect } from 'chai';
import { Test } from '..';

export default Test.describe('One', (e) => {
  e.it('one.foo', () => {
    expect(123).to.eql(123);
  });
});
