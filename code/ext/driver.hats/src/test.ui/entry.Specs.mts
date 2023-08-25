export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'protocol.hats.tests': () => import('./-TestRunner'),
  'protocol.hats.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
};

export default Specs;
