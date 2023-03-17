export const Specs = {
  'sys.crdt.tests': () => import('./-TestRunner'),
  'sys.crdt.ui.CrdtInfo': () => import('../ui/CrdtInfo/-SPEC'),
};

export default Specs;
