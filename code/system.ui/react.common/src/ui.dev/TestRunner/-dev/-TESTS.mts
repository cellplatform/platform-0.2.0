/**
 * Sample
 */
export const TESTS = {
  get all() {
    return [
      import('./-TEST.sample-1.mjs'),
      'MyTitle',
      import('./-TEST.sample-2.mjs'),
      import('./-TEST.controller.mjs'),
    ];
  },
};
