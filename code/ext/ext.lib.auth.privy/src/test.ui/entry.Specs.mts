export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.auth.privy.tests': () => import('./-TestRunner'),
  'ext.lib.auth.privy.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
