export const Specs = {
  'sys.net.webrtc': () => import('../ui/ui.ide/-SPEC'),
  'sys.net.webrtc.ide': () => import('../ui/ui.ide/-SPEC'),

  'sys.net.webrtc.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'sys.net.webrtc.ui.PeerCard': () => import('../ui/ui.PeerCard/-SPEC'),
  'sys.net.webrtc.ui.ConnectInput': () => import('../ui/ui.ConnectInput/-dev/-SPEC'),

  'sys.net.webrtc.ui.PeerId': () => import('../ui/ui.PeerId/-SPEC'),
  'sys.net.webrtc.ui.PeerList.Item': () => import('../ui/ui.PeerList.Item/-SPEC'),
  'sys.net.webrtc.tests': () => import('./-TestRunner'),

  'sys.net.nostr': () => import('../sys.net.nostr/Nostr.Client.SPEC'),
  'sys.net.webrtc._archive.01': () => import('../WebRtc/-dev/-SPEC'),
};

export default Specs;
