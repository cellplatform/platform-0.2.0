import { Chain, type t } from '../common';
import { DEFAULTS as PROVIDER_DEFAULTS } from '../ui.Auth/common';

export * from '../common';

/**
 * Constants
 */
const allFields: t.InfoField[] = [
  'Module',
  'Module.Verify',
  'Id.User',
  'Id.User.Phone',
  'Id.App.Privy',
  'Id.App.WalletConnect',
  'Login',
  'Login.SMS',
  'Login.Farcaster',
  'AccessToken',
  'Link.Wallet',
  'Link.Farcaster',
  'Wallet.List',
  'Wallet.List.Title',
  'Chain.List',
  'Chain.List.Title',
  'Chain.List.Testnets',
  'Refresh',
  'Refresh.Label',
];
const defaultFields: t.InfoField[] = ['Module', 'Id.User', 'Login', 'Link.Wallet'];

const data: t.InfoData = {
  chain: {
    names: Chain.names,
    selected: 'Op:Main',
  },
};

export const DEFAULTS = {
  query: { dev: 'dev' },
  fields: { all: allFields, default: defaultFields },
  enabled: true,
  clipboard: true,
  data,
  loginMethods: PROVIDER_DEFAULTS.loginMethods,
} as const;
