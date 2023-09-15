export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.ipfs.pinning.tests': () => import('./-TestRunner'),
  'ext.ipfs.pinning.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
