export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/u.Is.TEST'),

      'Store',
      import('../crdt.web/Store.Web/-TEST'),
      import('../crdt.web/Store.Web/-TEST.Storage'),
      import('../crdt.web/Store.Web/-TEST.Sync'),
      import('../crdt.web/Store.Web.Index/-TEST'),
      import('../crdt.web/Store.Web.IndexDb/-TEST'),

      'UI.Repo',
      import('../ui/ui.RepoList.Model/-TEST'),
    ];
  },
};
