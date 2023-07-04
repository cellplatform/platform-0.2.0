export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.net.webrtc': () => import('../ui/ui.Info/-dev/-SPEC'),

  'sys.net.webrtc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'sys.net.webrtc.ui.Info.PeerRow': () => import('../ui/ui.Info/-dev/-SPEC.PeerRow'),
  'sys.net.webrtc.ui.Info.PeerCtrls': () => import('../ui/ui.Info/-dev/-SPEC.PeerCtrls'),
  'sys.net.webrtc.ui.Connect': () => import('../ui/ui.Connect/-SPEC'),
  'sys.net.webrtc.ui.PeerInput': () => import('../ui/ui.PeerInput/-SPEC'),
  'sys.net.webrtc.ui.GroupVideo': () => import('../ui/ui.GroupVideo/-SPEC'),

  'sys.net.webrtc.ui.PeerId': () => import('../ui/ui.PeerId/-SPEC'),
  'sys.net.webrtc.ide': () => import('../ui/ui.IDE/-SPEC'),
  'sys.net.webrtc.tests': () => import('./-TestRunner'),

  'sys.net.nostr': () => import('../sys.net.nostr/Nostr.Client.SPEC'),

  'sys.net.webrtc._archive.01': () => import('../WebRtc/-dev/-SPEC'),
  'sys.net.webrtc._archive.01.ui.PeerCard': () => import('../ui/ui.PeerCard/-SPEC'),
  'sys.net.webrtc._archive.01.ui.PeerList.Item': () => import('../ui/ui.PeerList.Item/-SPEC'),
};

export default Specs;
