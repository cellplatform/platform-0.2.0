export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.automerge.webrtc.tests': () => import('./-TestRunner'),
  'ext.lib.automerge.webrtc.test.db': () => import('./TestDb.SPEC'),
  'ext.lib.automerge.webrtc.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Connection': () => import('../ui/ui.Connection/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Sample.02': () => import('../ui/ui.Sample.02/-SPEC'),
  'ext.lib.automerge.webrtc.ui.Sample.02.edge': () => import('../ui/ui.Sample.02/-SPEC.edge'),
};

export default Specs;
