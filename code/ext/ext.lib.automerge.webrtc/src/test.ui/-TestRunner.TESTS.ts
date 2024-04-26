export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST'),
      import('../Store.Network/-TEST'),
      'Integration Tests',
      import('../Store.Network/-TEST.integration'),
      import('../Store.Network/-TEST.Shared.integration'),
    ];
  },
};
