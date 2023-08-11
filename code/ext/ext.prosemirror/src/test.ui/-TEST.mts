import { Pkg } from '../index.pkg.mjs';
import { expect, Test } from '../test.ui';

export default Test.describe('Module', (e) => {
  e.it('has a package <ModuleDef>', (e) => {
    expect(typeof Pkg.name).to.eql('string');
    expect(typeof Pkg.version).to.eql('string');
  });

  e.it.skip('TODO:', async (e) => {
    //
  });
});
