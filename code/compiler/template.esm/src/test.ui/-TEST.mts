import { expect, Test } from '../test.ui';
import { Pkg } from '../index.pkg.mjs';

export default Test.describe('Module', (e) => {
  e.it('Pkg.name', async (e) => {
    expect(typeof Pkg.name).to.eql('string');
  });
});
