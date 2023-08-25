export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.driver.automerge.tests': () => import('./-TestRunner'),
  'ext.driver.automerge.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
