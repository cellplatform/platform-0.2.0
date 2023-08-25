export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.driver.crdt.automerge.tests': () => import('./-TestRunner'),
  'ext.driver.crdt.automerge.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
