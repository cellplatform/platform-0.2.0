export const TESTS = {
  get all() {
    return [import('./-TEST.mjs'), import('../driver.repo/TEST')];
  },
};
