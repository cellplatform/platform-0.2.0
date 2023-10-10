export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Webrtc/Peer.TEST'),

      //
      'Integration Tests',
      import('../Webrtc/Peer.TEST.integration'),
    ];
  },
};
