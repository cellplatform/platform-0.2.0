export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../common/Is.TEST'),
      import('../ui.Store/WebStore.TEST'),
    ];
  },
};
