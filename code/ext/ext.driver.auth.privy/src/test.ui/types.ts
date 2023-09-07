import type * as t from './types';
export * from '../ui/common/types';

export type TestCtx = {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
};
