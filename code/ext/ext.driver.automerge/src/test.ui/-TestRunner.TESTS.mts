export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST.mjs'),
      import('../repo/Peer.TEST'),
    ];
  },
};
