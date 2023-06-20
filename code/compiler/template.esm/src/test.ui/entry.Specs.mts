export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'NAMESPACE.tests': () => import('./-TestRunner'),
  'NAMESPACE.ui.root': () => import('../ui/-SPEC'),
};

export default Specs;
