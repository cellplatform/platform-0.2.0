export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.driver.auth.privy.tests': () => import('./-TestRunner'),
  'ext.driver.auth.privy.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
