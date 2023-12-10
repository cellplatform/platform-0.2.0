export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.peerjs.tests': () => import('./-TestRunner'),
  'ext.lib.peerjs.test.ui.PeerCard': () => import('../ui/ui.Dev.PeerCard/-SPEC'),
  'ext.lib.peerjs.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.peerjs.ui.AvatarTray': () => import('../ui/ui.AvatarTray/-SPEC'),
  'ext.lib.peerjs.ui.Video': () => import('../ui/ui.Video/-SPEC'),
  'ext.lib.peerjs.ui.Connector': () => import('../ui/ui.Connector/-SPEC'),
  'ext.lib.peerjs.ui.Connector.MediaToolbar': () => import('../ui/ui.Connector.MediaToolbar/-SPEC'),
};

export default Specs;
