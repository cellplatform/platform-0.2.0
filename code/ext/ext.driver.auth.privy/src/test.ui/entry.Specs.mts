export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.wallet.privy.tests': () => import('./-TestRunner'),
  'ext.wallet.privy.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.wallet.privy.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
