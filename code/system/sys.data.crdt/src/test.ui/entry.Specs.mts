export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.data.crdt.tests': () => import('./-TestRunner'),
  'sys.data.crdt.ui.Info': () => import('../ui/Crdt.Info/-dev/-SPEC'),
  'sys.data.crdt.ui.History': () => import('../ui/Crdt.History/-SPEC'),
  'sys.data.crdt.ui.Namespace': () => import('../ui/Crdt.Namespace/-dev/-SPEC'),
  'sys.data.crdt.types.Text': () => import('../test.ui.specs/-SPEC.Text'),

  'sys.ui.common.Item.LabelItem': () => import('../-sys.ui.common/LabelItem/-dev/-SPEC'),
  'sys.ui.common.Item.LabelItem.Stateful': () =>
    import('../-sys.ui.common/LabelItem.Stateful/-dev/-Spec'),
};

export default Specs;
