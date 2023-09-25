export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'NAMESPACE.tests': () => import('./-TestRunner'),
  'NAMESPACE.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'NAMESPACE.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
