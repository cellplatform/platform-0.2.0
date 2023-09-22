export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST.mjs'),
      import('../repo/Peer.TEST'),
      import('../repo/Repo.TEST'),
    ];
  },
};
