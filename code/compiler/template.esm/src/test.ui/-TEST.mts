import { Pkg } from '../index.pkg.mjs';
import { expect, Test } from '../test.ui';

export default Test.describe('Module', (e) => {
  e.it('TODO:', async (e) => {
    expect(typeof Pkg.name).to.eql('string');
  });
});
