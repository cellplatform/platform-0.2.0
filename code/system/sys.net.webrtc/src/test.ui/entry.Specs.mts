export const Specs = {
  'sys.net.webrtc.-legacy': () => import('./-SPEC'),
  'sys.net.webrtc': () => import('../WebRTC/-SPEC'),
};

export default Specs;
