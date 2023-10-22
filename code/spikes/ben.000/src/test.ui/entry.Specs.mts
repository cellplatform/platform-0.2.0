export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'spike.ben.tests': () => import('./-TestRunner'),
  'spike.ben.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
