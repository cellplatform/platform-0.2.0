export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/Is.TEST'),
      'Store',
      import('../Store.Web/-TEST'),
      import('../Store.Web/-TEST.Storage'),
      import('../Store.Web/-TEST.Sync'),
      import('../Store.Web/-TEST.Index'),
      import('../Store.Web.IndexDb/-TEST'),
      'UI.Repo',
      import('../ui/ui.RepoList.Model/-TEST'),
    ];
  },
};
