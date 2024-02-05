import { login } from './field.Auth.Login';
import { chainList } from './field.Chain.List';
import { linkFarcaster } from './field.Link.Farcaster';
import { linkWallet } from './field.Link.Wallet';
import { moduleVerify } from './field.Module.Verify';
import { refresh } from './field.Refresh';
import { walletsList } from './field.Wallets.List';

export const Field = {
  login,
  chainList,
  moduleVerify,
  refresh,
  walletsList,
  linkWallet,
  linkFarcaster,
} as const;
