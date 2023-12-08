import { login } from './field.Auth.Login';
import { chainList } from './field.Chain.List';
import { moduleVerify } from './field.Module.Verify';
import { refresh } from './field.Refresh';
import { linkWallet } from './field.Wallets.Link';
import { walletsList } from './field.Wallets.List';

export const Field = {
  login,
  chainList,
  moduleVerify,
  refresh,
  linkWallet,
  walletsList,
} as const;
