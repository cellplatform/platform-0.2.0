export const Specs = {
  'sys.net.webrtc': () => import('../WebRTC/-SPEC'),
  'sys.net.webrtc.ui.PeerId': () => import('../ui/ui.PeerId/-SPEC'),
  'sys.net.webrtc.ui.PeerVideo': () => import('../ui/ui.PeerVideo/-SPEC'),
};

export default Specs;
