export const TESTS = {
  get all() {
    return [
      'Document (CRDT)',
      import('../crdt/crdt.DocRef/-TEST.mjs'),
      import('../crdt/crdt.DocFile/-TEST.mjs'),

      'Network',
      import('../crdt/crdt.DocSync/-dev/-TEST.DocSync.mjs'),
      import('../crdt/crdt.DocSync/-dev/-TEST.PeerSyncer.mjs'),

      'Data Model',
      import('../crdt/crdt.Schema/-dev/-TEST.mjs'),
      import('../crdt/crdt.Lens/-TEST.mjs'),
      import('../crdt/crdt.Lens.Namespace/-TEST.mjs'),
      import('../crdt/crdt.Repo/-TEST.mjs'),
      import('../crdt/crdt.Func/-TEST.mjs'),

      'Helpers',
      import('../crdt/helpers/-TEST.mjs'),

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
