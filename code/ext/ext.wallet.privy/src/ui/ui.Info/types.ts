import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Login'
  | 'Login.Method.Wallet'
  | 'Login.Method.SMS';

export type InfoData = {
  provider?: { appId?: string; onSuccess?: t.AuthProviderSuccessHandler };
  url?: { href: string; title?: string };
};

/**
 * Component
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  useAuthProvider?: boolean;
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};
