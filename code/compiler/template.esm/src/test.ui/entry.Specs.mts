export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'NAMESPACE.tests': () => import('./-TestRunner'),
  'NAMESPACE.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
