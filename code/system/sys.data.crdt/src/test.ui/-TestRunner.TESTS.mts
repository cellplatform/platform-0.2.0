export const TESTS = {
  get all() {
    return [
      'Document (CRDT)',
      import('../crdt.DocRef/-TEST.mjs'),
      import('../crdt.DocFile/-TEST.mjs'),

      'Network',
      import('../crdt.DocSync/-dev/-TEST.DocSync.mjs'),
      import('../crdt.DocSync/-dev/-TEST.PeerSyncer.mjs'),

      'Data Model',
      import('../crdt.Schema/-dev/-TEST.mjs'),
      import('../crdt.Lens/-TEST.mjs'),
      // import('../crdt.Lens/-TEST.Namespace.mjs'),
      import('../crdt.Lens.Namespace/-TEST.mjs'),
      import('../crdt.Repo/-TEST.mjs'),
      import('../crdt.Func/-TEST.mjs'),

      'Helpers',
      import('../crdt.helpers/-TEST.mjs'),

      'Driver (Automerge)',
      import('../driver.Automerge/-dev/-TEST.basic.mjs'),
      import('../driver.Automerge/-dev/-TEST.api.mjs'),
      import('../driver.Automerge/-dev/-TEST.initialState.mjs'),
      import('../driver.Automerge/-dev/-TEST.immutability.mjs'),
      import('../driver.Automerge/-dev/-TEST.filesystem.mjs'),
      import('../driver.Automerge/-dev/-TEST.sync.mjs'),
    ];
  },
};
