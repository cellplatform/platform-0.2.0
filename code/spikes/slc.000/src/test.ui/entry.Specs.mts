export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'slc.ui.Root.IFrame': () => import('../ui/Root.IFrame/-SPEC'),
};

export default Specs;
