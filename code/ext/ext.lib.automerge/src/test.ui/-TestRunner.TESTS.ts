export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/u.Is.TEST'),

      'Store',
      import('../logic/Store.Web/-TEST'),
      import('../logic/Store.Web/-TEST.Storage'),
      import('../logic/Store.Web/-TEST.Sync'),
      import('../logic/Store.Web.Index/-TEST'),
      import('../logic/Store.Web.IndexDb/-TEST'),

      'UI.Repo',
      import('../ui/ui.RepoList.Model/-TEST'),
    ];
  },
};
