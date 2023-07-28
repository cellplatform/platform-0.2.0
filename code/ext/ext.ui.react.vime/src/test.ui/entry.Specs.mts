export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.ui.vime.tests': () => import('./-TestRunner'),
  'ext.ui.vime.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'ext.ui.vime.ui.Player': () => import('../ui/ui.Player/-dev/-SPEC'),
};

export default Specs;
