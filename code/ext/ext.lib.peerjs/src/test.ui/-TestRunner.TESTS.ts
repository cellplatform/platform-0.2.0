export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Webrtc.PeerJs/-TEST'),

      //
      'Integration Tests',
      import('../Webrtc/-TEST.Peer.integration'),
    ];
  },
};
