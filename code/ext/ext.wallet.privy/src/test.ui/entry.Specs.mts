export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.wallet.privy.tests': () => import('./-TestRunner'),
  'ext.wallet.privy.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
