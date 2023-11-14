export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../IndexedDb/-TEST'),
    ];
  },
};
