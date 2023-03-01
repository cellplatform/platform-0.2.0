export const Specs = {
  'sys.net.webrtc': () => import('../WebRTC/-SPEC'),
  'sys.net.webrtc.ui.PeerId': () => import('../ui/ui.PeerId/-SPEC'),
  'sys.net.webrtc.ui.PeerVideo': () => import('../ui/ui.PeerVideo/-SPEC'),
  'sys.net.webrtc.ui.PeerList.Item': () => import('../ui/ui.PeerList.Item/-SPEC'),
  'sys.net.webrtc.tests': () => import('./-dev/TestRunner'),

  'sys.net.nostr': () => import('../sys.net.nostr/Nostr.Client.SPEC'),
};

export default Specs;
