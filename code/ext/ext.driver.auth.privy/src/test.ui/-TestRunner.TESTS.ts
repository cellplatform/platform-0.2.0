export const TESTS = {
  get all() {
    return [
      import('./-TEST'),
      import('../evm/Chain/Chain.TEST'),
      import('../evm/Balance/Balance.TEST'),
      import('../http/ExchangeRate/-TEST'),
    ];
  },
};
