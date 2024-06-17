export const TESTS = {
  get all() {
    return [
      import('./-TEST'),
      import('../evm/Chain/Chain.TEST'),
      import('../evm/Balance/Balance.TEST'),
      import('../evm/Wallet/Wallet.TEST'),
    ];
  },
};
