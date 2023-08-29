export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.driver.auth.privy.tests': () => import('./-TestRunner'),
  'ext.driver.auth.privy.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.driver.auth.privy.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
