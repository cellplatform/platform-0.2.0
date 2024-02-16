export const TESTS = {
  get all() {
    return [
      //
      import('../ui/Module.Loader/-TEST'),

      'ui.dev',
      import('../ui.dev/common/Is.TEST'),
    ];
  },
};
