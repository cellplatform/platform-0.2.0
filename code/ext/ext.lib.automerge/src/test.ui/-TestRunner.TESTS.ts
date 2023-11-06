export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/Is.TEST'),
      import('../Store.Web/WebStore.TEST'),
    ];
  },
};
