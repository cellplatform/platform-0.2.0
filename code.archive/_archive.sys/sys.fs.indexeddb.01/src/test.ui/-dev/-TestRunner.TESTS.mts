export const TESTS = {
  get all() {
    return [
      //
      import('./-TEST.Functional.mjs'),
      import('./-TEST.ItegrityChecks.mjs'),
    ];
  },
};
