export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.driver.protocol.hats.tests': () => import('./-TestRunner'),
  'ext.driver.protocol.hats.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
};

export default Specs;
