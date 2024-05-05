export const TESTS = {
  get all() {
    return [
      'Integration Tests',
      import('../Store.Network/-TEST.integration'),

      'Unit Tests',
      import('./-TEST'),
      import('../Store.Network/-TEST'),
    ];
  },
};
