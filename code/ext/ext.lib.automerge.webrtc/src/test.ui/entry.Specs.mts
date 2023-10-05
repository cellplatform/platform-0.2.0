export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.automerge.webrtc.tests': () => import('./-TestRunner'),
  'ext.lib.automerge.webrtc.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
