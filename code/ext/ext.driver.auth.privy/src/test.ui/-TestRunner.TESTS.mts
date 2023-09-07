export const TESTS = {
  get all() {
    return [
      import('./-TEST.mjs'),
      import('../evm/Chain/Chain.TEST'),
      import('../evm/Balance/Balance.TEST'),
      import('../http/ExchangeRate/-TEST'),
    ];
  },
};
