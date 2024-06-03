import { expect } from 'chai';
import { Test } from '../..';

export default Test.describe('One', (e) => {
  e.it('one.foo', () => {
    expect(123).to.eql(123);
  });
});

export const MySpec1 = Test.describe('MySpec1', (e) => {
  e.it('one.foo-1', (e) => {});
});

export const MySpec2 = Test.describe('MySpec2', (e) => {
  e.it('one.foo-2', (e) => {});
});

export const MySpec3 = MySpec1; // NB: Duplicate specs filtered out within [Test.import]
