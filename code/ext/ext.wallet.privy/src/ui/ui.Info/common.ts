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
  'User.Id',
];
const defaultFields: t.InfoField[] = ['Module', 'Login', 'Login.Method.SMS'];
const data: t.InfoData = {};

export const DEFAULTS = {
  query: { dev: 'dev' },
  fields: { all: allFields, default: defaultFields },
  useAuthProvider: true,
  data,
} as const;
