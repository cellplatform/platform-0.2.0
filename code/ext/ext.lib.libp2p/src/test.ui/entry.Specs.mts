export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.libp2p.tests': () => import('./-TestRunner'),
  'ext.lib.libp2p.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.libp2p.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
