export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.peerjs.tests': () => import('./-TestRunner'),
  'ext.lib.peerjs.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.peerjs.ui.AvatarTray': () => import('../ui/ui.AvatarTray/-SPEC'),
  'ext.lib.peerjs.ui.Connector': () => import('../ui/ui.Connector/-SPEC'),
  'ext.lib.peerjs.ui.Connector.MediaToolbar': () => import('../ui/ui.Connector.MediaToolbar/-SPEC'),
  'ext.lib.peerjs.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
  'ext.lib.peerjs.ui.Sample.02': () => import('../ui/ui.Sample.02/-SPEC'),
  'ext.lib.peerjs.ui.Sample.03': () => import('../ui/ui.Sample.03/-SPEC'),
};

export default Specs;
