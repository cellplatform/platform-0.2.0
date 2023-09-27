export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Webrtc_/Webrtc.Peer.TEST'),
    ];
  },
};
