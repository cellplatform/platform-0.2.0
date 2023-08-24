import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const loginMethods: t.AuthLoginMethod[] = ['sms', 'wallet'];

export const DEFAULTS = {
  loginMethods,
} as const;
