import { type t } from '../common';

export const Wallet = {
  is: {
    embedded(wallet?: t.ConnectedWallet) {
      return wallet?.walletClientType === 'privy';
    },
  },

  embedded(wallets: t.ConnectedWallet[]) {
    return wallets.find((wallet) => Wallet.is.embedded(wallet));
  },
} as const;
