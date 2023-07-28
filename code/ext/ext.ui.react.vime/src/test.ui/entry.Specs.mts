export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.ui.vime.tests': () => import('./-TestRunner'),
  'ext.ui.vime.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'ext.ui.vime.ui.Player': () => import('../ui/Player/-dev/-SPEC'),
};

export default Specs;
