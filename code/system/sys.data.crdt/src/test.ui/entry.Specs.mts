export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.data.crdt.tests': () => import('./-TestRunner'),
  'sys.data.crdt.ui.Info': () => import('../ui/Crdt.Info/-SPEC'),
  'sys.data.crdt.ui.History': () => import('../ui/Crdt.History/-SPEC'),
  'sys.data.crdt.ui.Namespace': () => import('../ui/Crdt.Namespace/-SPEC'),
  'sys.data.crdt.types.Text': () => import('./-SPEC.Text'),
};

export default Specs;
