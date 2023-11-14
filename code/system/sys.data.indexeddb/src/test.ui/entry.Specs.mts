export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.data.indexeddb.tests': () => import('./-TestRunner'),
  'sys.data.indexeddb.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
