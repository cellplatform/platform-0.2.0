export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/Is.TEST'),
      import('../Store.Web/-TEST'),
      import('../Store.Web/-TEST.storage'),
      import('../Store.Web/-TEST.sync'),
    ];
  },
};
