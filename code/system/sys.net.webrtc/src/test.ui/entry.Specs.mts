export const Specs = {
  'sys.net.webrtc': () => import('../WebRTC/-dev/-SPEC'),
  'sys.net.webrtc.ui.PeerId': () => import('../ui/ui.PeerId/-SPEC'),
  'sys.net.webrtc.ui.PeerVideo': () => import('../ui/ui.PeerVideo/-dev/-SPEC'),
  'sys.net.webrtc.ui.PeerList.Item': () => import('../ui/ui.PeerList.Item/-SPEC'),
  'sys.net.webrtc.tests': () => import('./-TestRunner'),

  'sys.net.nostr': () => import('../sys.net.nostr/Nostr.Client.SPEC'),
};

export default Specs;
