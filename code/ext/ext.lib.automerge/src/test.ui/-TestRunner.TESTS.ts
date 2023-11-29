export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/u.Is.TEST'),
      import('../common/u.As.TEST'),
      'Store',
      import('../Store.Web/-TEST'),
      import('../Store.Web/-TEST.Storage'),
      import('../Store.Web/-TEST.Sync'),
      import('../Store.Web.Index/-TEST'),
      import('../Store.Web.IndexDb/-TEST'),
      'UI.Repo',
      import('../ui/ui.RepoList.Model/-TEST'),
    ];
  },
};
