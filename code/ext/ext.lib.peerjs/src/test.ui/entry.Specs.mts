export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.peerjs.tests': () => import('./-TestRunner'),
  'ext.lib.peerjs.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.peerjs.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
  'ext.lib.peerjs.ui.Connector': () => import('../ui/ui.Connector/-dev/-SPEC'),
};

export default Specs;
