export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'NAMESPACE.tests': () => import('./-TestRunner'),
  'NAMESPACE.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
};

export default Specs;
