export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'slc.ui.Landing.IFrame': () => import('../ui/Landing.IFrame/-SPEC'),
  'slc.ui.Landing.Ember': () => import('../ui/Landing.Ember/-SPEC'),
};

export default Specs;
