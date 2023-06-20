export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'NAMESPACE.tests': () => import('./-TestRunner'),
  'NAMESPACE.ui': () => import('../ui/-SPEC'),
};

export default Specs;
