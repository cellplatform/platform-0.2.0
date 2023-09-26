export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../crdt.Store/-TEST'),
      import('../common/Is.TEST'),
    ];
  },
};
