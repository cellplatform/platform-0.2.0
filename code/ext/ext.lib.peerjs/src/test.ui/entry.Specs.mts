export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.peerjs.tests': () => import('./-TestRunner'),
  'ext.lib.peerjs.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.peerjs.ui.AvatarTray': () => import('../ui/ui.AvatarTray/-SPEC'),
  'ext.lib.peerjs.ui.Video': () => import('../ui/ui.Video/-SPEC'),
  'ext.lib.peerjs.ui.Connector': () => import('../ui/ui.Connector/-SPEC'),
  'ext.lib.peerjs.ui.Connector.MediaToolbar': () => import('../ui/ui.Connector.MediaToolbar/-SPEC'),
  'ext.lib.peerjs.ui.dev.PeerCard': () => import('../ui/ui.dev.PeerCard/-SPEC'),
  'ext.lib.peerjs.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
};

export default Specs;
