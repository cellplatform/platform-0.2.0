export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Webrtc/Webrtc.Peer.TEST'),
      'Integration Tests',
      import('../Webrtc/Webrtc.Peer.TEST.integration'),
    ];
  },
};
