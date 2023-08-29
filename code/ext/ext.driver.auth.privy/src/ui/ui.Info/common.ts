import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const allFields: t.InfoField[] = [
  'Module',
  'Module.Verify',
  'Login',
  'Login.Method.Wallet',
  'Login.Method.SMS',
  'Id.User',
  'Id.App.Privy',
  'Id.App.WalletConnect',
];
const defaultFields: t.InfoField[] = [
  'Module',
  'Login',
  'Login.Method.SMS',
  'Login.Method.Wallet',
  'Id.User',
];
const data: t.InfoData = {};

export const DEFAULTS = {
  query: { dev: 'dev' },
  fields: { all: allFields, default: defaultFields },
  useAuthProvider: true,
  clipboard: true,
  data,
} as const;
