import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const loginMethods: t.AuthLoginMethod[] = ['sms', 'wallet'];

export const DEFAULTS = {
  loginMethods,

  /**
   * Source:
   *    https://github.com/cellplatform/platform-0.2.0/issues/159
   */
  logoUrl:
    'https://user-images.githubusercontent.com/185555/262834108-4efb7e56-ac2a-4fcb-b747-2e1245df09e0.png',
} as const;
