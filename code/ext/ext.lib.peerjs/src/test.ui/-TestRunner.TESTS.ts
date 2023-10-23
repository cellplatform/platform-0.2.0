export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Webrtc/-TEST.Peer'),

      //
      'Integration Tests',
      import('../Webrtc/-TEST.Peer.integration'),
    ];
  },
};
