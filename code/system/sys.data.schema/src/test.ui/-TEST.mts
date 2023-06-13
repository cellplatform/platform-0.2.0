import { expect, Test } from '../test.ui';

export default Test.describe('foo', (e) => {
  e.it('foobar', (e) => {
    expect(1234).to.eql(1234);
  });
});
