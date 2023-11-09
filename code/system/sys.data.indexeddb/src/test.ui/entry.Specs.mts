export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.data.indexeddb.tests': () => import('./-TestRunner'),
  'sys.data.indexeddb.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'sys.data.indexeddb.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
};

export default Specs;
