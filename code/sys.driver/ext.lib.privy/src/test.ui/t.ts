import type * as t from './t';
export * from '../ui/common/t';

export type TestCtx = {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
};
