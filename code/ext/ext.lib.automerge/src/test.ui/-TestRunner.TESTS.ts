export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/u.Is.TEST'),

      'Store',
      import('../crdt/Store.Web/-TEST'),
      import('../crdt/Store.Web/-TEST.Storage'),
      import('../crdt/Store.Web/-TEST.Sync'),
      import('../crdt/Store.Web.Index/-TEST'),
      import('../crdt/Store.Web.IndexDb/-TEST'),

      'UI.Repo',
      import('../ui/ui.RepoList.Model/-TEST'),
    ];
  },
};
