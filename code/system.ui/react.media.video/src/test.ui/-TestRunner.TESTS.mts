export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST.mjs'),
      import('../ui.Root/-TEST.mjs'),
      import('../common/Is.TEST.mjs'),
    ];
  },
};
