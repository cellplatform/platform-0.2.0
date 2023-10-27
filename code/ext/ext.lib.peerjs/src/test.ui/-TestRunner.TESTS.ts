export const TESTS = {
  get all() {
    return [
      //
      'Integration Tests',
      import('../Webrtc/-TEST.integration'),
      //
      'Unit Tests',
      import('./-TEST'),
      import('../Webrtc.PeerJs/-TEST'),
    ];
  },
};
