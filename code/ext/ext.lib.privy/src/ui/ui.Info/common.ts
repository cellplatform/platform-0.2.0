import { Chain, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const allFields: t.InfoField[] = [
  'Module',
  'Module.Verify',
  'Refresh',
  'Id.User',
  'Id.User.Phone',
  'Id.App.Privy',
  'Id.App.WalletConnect',
  'Auth.Login',
  'Auth.Link.Wallet',
  'Wallet.List',
  'Wallet.List.Title',
  'Chain.List',
  'Chain.List.Title',
  'Chain.List.Testnets',
];
const defaultFields: t.InfoField[] = [
  'Module',
  'Id.User',
  'Id.User.Phone',
  'Auth.Login',
  'Auth.Link.Wallet',
];

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
  useAuthProvider: true,
  clipboard: true,
  data,
} as const;
