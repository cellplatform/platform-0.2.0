export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../ui.Store/WebStore.TEST'),
      import('../common/Is.TEST'),
    ];
  },
};
