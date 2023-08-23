import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const allFields: t.InfoField[] = [
  'Module',
  'Module.Verify',
  'Login.Method.Wallet',
  'Login.Method.SMS',
  'Login.Method.Email',
];
const defaultFields: t.InfoField[] = [
  'Module',
  'Module.Verify',
  'Login.Method.SMS',
  'Login.Method.Wallet',
];

export const DEFAULTS = {
  fields: { all: allFields, default: defaultFields },
  query: { dev: 'dev' },
} as const;
