import { Pkg } from '../index.pkg';
import { expect, Test } from '../test.ui';

export default Test.describe(`Module: ${Pkg.toString()}`, (e) => {
  e.it('has a package ModuleDef', (e) => {
    expect(typeof Pkg.name).to.eql('string');
    expect(typeof Pkg.version).to.eql('string');
  });
});
