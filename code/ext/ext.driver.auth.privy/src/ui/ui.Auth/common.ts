import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const loginMethods: t.AuthLoginMethod[] = ['sms', 'wallet'];

export const DEFAULTS = {
  loginMethods,
  logoUrl:
    'https://user-images.githubusercontent.com/185555/262841995-1c11bcd3-1360-451d-ad24-93407bf28356.png',
} as const;
