export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST.mjs'),
      import('../common/Is.TEST.mjs'),
    ];
  },
};
