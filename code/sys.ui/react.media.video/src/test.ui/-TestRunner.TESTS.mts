export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST.mjs'),
      import('../ui.Video/Video.src.TEST.mjs'),
      import('../common/Is.TEST'),
    ];
  },
};
