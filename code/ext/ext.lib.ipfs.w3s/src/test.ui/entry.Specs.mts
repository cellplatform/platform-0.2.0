export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.ipfs.w3s.tests': () => import('./-TestRunner'),
  'ext.lib.ipfs.w3s.ui.Info': () => import('../ui/ui.Info/-SPEC'),

  'ext.lib.ipfs.w3s.ui.Sample.web3storage': () => import('../ui/ui.Sample.web3storage/-SPEC'),
  'ext.lib.ipfs.w3s.ui.Sample.w3up': () => import('../ui/ui.Sample.w3up/-SPEC'),
};

export default Specs;
