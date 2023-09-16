export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.ext.driver.ipfs.w3s.tests': () => import('./-TestRunner'),
  'ext.ext.driver.ipfs.w3s.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.ext.driver.ipfs.w3s.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
