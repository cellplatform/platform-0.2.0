export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.automerge.webrtc.tests': () => import('./-TestRunner'),
  'ext.lib.automerge.webrtc.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Sample.02': () => import('../ui/ui.Sample.02/-SPEC'),
};

export default Specs;
