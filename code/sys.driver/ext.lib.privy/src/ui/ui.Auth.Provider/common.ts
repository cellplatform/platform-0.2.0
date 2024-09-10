import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const loginMethods: t.AuthProviderLoginMethods = ['sms'];

/**
 * Source:
 *    https://github.com/cellplatform/platform-0.2.0/issues/159
 */
const logoUrl = `https://user-images.githubusercontent.com/185555/262834108-4efb7e56-ac2a-4fcb-b747-2e1245df09e0.png`;

export const DEFAULTS = {
  displayName: `${Pkg.name}:AuthProvider`,
  defaultCountry: 'NZ',
  loginMethods,
  logoUrl,
} as const;
