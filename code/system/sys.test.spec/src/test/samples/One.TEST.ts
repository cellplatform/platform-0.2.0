import { expect } from 'chai';
import { Test } from '../../index.mjs';

export default Test.describe('One', (e) => {
  e.it('one.foo', () => {
    expect(123).to.eql(123);
  });
});

export const MySpec = Test.describe('MySpec', (e) => {
  e.it('my.foo', (e) => {});
});
