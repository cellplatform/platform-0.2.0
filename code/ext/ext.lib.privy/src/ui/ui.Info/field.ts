import { accessToken } from './field.u.AccessToken';
import { chainList } from './field.u.Chain.List';
import { farcasterIdentity } from './field.u.Farcaster.Identity';
import { walletLink } from './field.u.Wallet.Link';
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
  walletLink,
  farcasterIdentity,
} as const;
