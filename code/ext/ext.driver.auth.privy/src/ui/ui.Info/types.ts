import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Login'
  | 'Login.Method.Wallet'
  | 'Login.Method.SMS'
  | 'Id.User'
  | 'Id.App.Privy'
  | 'Id.App.WalletConnect';

export type InfoData = {
  provider?: { appId?: string; walletConnectId?: string };
  url?: { href: string; title?: string };
};

/**
 * Component
 */
export type InfoProps = {
  enabled?: boolean;
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  useAuthProvider?: boolean;
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  clipboard?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
  onChange?: t.InfoStatusHandler;
};

/**
 * Events
 */
export type InfoStatusHandler = (e: InfoStatusHandlerArgs) => void;
export type InfoStatusHandlerArgs = {
  readonly status: t.AuthStatus;
  readonly privy: t.PrivyInterface;
};
