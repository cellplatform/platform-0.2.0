export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.ext.driver.ipfs.w3s.tests': () => import('./-TestRunner'),
  'ext.ext.driver.ipfs.w3s.ui.Info': () => import('../ui/ui.Info/-SPEC'),

  'ext.ext.driver.ipfs.w3s.ui.Sample.web3.storage': () =>
    import('../ui/ui.Sample.client-now/-SPEC'),
  'ext.ext.driver.ipfs.w3s.ui.Sample.web3up-client': () =>
    import('../ui/ui.Sample.client-next/-SPEC'),
};

export default Specs;
