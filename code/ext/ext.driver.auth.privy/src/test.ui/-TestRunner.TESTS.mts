export const TESTS = {
  get all() {
    return [import('./-TEST.mjs'), import('../evm/Chain/Chains.TEST')];
  },
};
