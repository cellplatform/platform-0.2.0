export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../WebRtc/WebRtc.Peer.TEST'),
    ];
  },
};
