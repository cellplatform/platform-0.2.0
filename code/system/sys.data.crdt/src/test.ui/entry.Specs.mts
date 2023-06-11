export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.crdt.tests': () => import('./-dev/-TestRunner'),
  'sys.crdt.ui.Info': () => import('../ui/Crdt.Info/-SPEC'),
  'sys.crdt.ui.History': () => import('../ui/Crdt.History/-SPEC'),
  'sys.crdt.types.Text': () => import('./-dev/-SPEC.Text'),
};

export default Specs;
