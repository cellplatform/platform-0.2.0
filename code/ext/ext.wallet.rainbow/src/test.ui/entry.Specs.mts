export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'vendor.wallet.rainbow.tests': () => import('./-TestRunner'),
  'vendor.wallet.rainbow.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'vendor.wallet.rainbow.ui.Connect': () => import('../ui/Connect/-SPEC'),
  'vendor.wallet.rainbow.ui.ChainSelector': () => import('../ui/ChainSelector/-SPEC'),
};

export default Specs;
