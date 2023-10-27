export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'NAMESPACE.tests': () => import('./-TestRunner'),
  'NAMESPACE.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'NAMESPACE.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
};

export default Specs;
