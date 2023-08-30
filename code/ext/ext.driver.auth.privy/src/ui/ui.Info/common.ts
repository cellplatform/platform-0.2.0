import { type t } from '../common';
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
  'Link.Wallet',
];
const defaultFields: t.InfoField[] = ['Module', 'Id.User', 'Id.User.Phone', 'Login'];
const data: t.InfoData = {};

export const DEFAULTS = {
  query: { dev: 'dev' },
  fields: { all: allFields, default: defaultFields },
  enabled: true,
  useAuthProvider: true,
  clipboard: true,
  data,
} as const;
