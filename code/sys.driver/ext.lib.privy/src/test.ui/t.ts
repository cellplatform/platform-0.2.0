import type * as t from '../ui/common/t';
export type * from '../ui/common/t';

export type TestCtx = {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
};
