export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Store.Network/-TEST.integration'),
      import('../Store.Network/-TEST'),
    ];
  },
};
