export const TESTS = {
  get all() {
    return [
      import('./-TEST'),
      import('../u.evm/Chain/Chain.TEST'),
      import('../u.evm/Balance/Balance.TEST'),
      import('../u.evm/Wallet/Wallet.TEST'),
    ];
  },
};
