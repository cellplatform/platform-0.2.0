export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../crdt.Store/Store.TEST'),
      import('../common/Is.TEST'),
    ];
  },
};
