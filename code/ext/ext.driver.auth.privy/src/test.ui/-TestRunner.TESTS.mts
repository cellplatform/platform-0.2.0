export const TESTS = {
  get all() {
    return [import('./-TEST.mjs'), import('../evm/Chain/Chain.TEST')];
  },
};
