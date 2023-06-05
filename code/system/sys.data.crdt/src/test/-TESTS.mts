export const TESTS = {
  get all() {
    return [
      import('../crdt.DocRef/-TEST.mjs'),
      import('../crdt.DocFile/-TEST.mjs'),
      import('../crdt.DocSync/-dev/-TEST.DocSync.mjs'),
      import('../crdt.DocSync/-dev/-TEST.PeerSyncer.mjs'),
      import('../crdt.Schema/-dev/-TEST.mjs'),
      import('../crdt.Lens/-dev/-TEST.mjs'),
      import('../crdt.helpers/-TEST.mjs'),

      import('../driver.Automerge/-dev/TEST.basic.mjs'),
      import('../driver.Automerge/-dev/TEST.api.mjs'),
      import('../driver.Automerge/-dev/TEST.initialState.mjs'),
      import('../driver.Automerge/-dev/TEST.filesystem.mjs'),
      import('../driver.Automerge/-dev/TEST.sync.mjs'),
    ];
  },
};
