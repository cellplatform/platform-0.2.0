export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'vendor.wallet.rainbow.tests': () => import('./-TestRunner'),
  'vendor.wallet.rainbow.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'vendor.wallet.rainbow.ui.Connect': () => import('../ui/Connect/-dev/-SPEC'),
};

export default Specs;
