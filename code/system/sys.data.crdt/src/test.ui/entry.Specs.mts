export const Specs = {
  'sys.crdt.tests': () => import('./-SPEC.TestRunner'),
  'sys.crdt.ui.CrdtInfo': () => import('../ui/CrdtInfo/-SPEC'),
};

export default Specs;
