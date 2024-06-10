import { accessToken } from './field.u.AccessToken';
import { chainList } from './field.u.Chain.List';
import { linkFarcaster } from './field.u.Link.Farcaster';
import { linkWallet } from './field.u.Link.Wallet';
import { login } from './field.u.Login';
import { moduleVerify } from './field.u.Module.Verify';
import { refresh } from './field.u.Refresh';
import { walletsList } from './field.u.Wallets.List';

export const Field = {
  login,
  accessToken,
  chainList,
  moduleVerify,
  refresh,
  walletsList,
  linkWallet,
  linkFarcaster,
} as const;
