import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Login.Method.Wallet'
  | 'Login.Method.Email'
  | 'Login.Method.SMS';

export type InfoData = {
  url?: { href: string; title?: string };
};
