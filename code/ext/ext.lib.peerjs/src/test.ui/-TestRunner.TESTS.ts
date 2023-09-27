export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Webrtc/Webrtc.Peer.TEST'),
    ];
  },
};
