export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.protocol.hats.tests': () => import('./-TestRunner'),
  'ext.lib.protocol.hats.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
};

export default Specs;
