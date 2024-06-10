import type { Farcaster } from '@privy-io/react-auth';
import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'AccessToken'
  | 'Id.User'
  | 'Id.User.Phone'
  | 'Id.App.Privy'
  | 'Id.App.WalletConnect'
  | 'Login'
  | 'Login.SMS'
  | 'Login.Farcaster'
  | 'Link.Farcaster'
  | 'Wallet.Link'
  | 'Wallet.List'
  | 'Wallet.List.Title'
  | 'Chain.List'
  | 'Chain.List.Title'
  | 'Chain.List.Testnets'
  | 'Refresh'
  | 'Refresh.Label';

export type InfoData = {
  provider?: { appId?: string; walletConnectId?: string };
  accessToken?: { label?: string; jwt?: string };
  chain?: {
    names?: t.EvmChainName[];
    selected?: t.EvmChainName;
    onSelected?: InfoChainSelectedHandler;
  };
  wallet?: { list?: { title?: string } };
  farcaster?: { onClick?: InfoFarcasterClickHandler };
};

export type InfoFieldModifiers = { keys: t.KeyboardModifierFlags; is: { over: boolean } };

export type InfoFieldArgs = {
  privy: t.PrivyInterface;
  data: t.InfoData;
  fields: t.InfoField[];
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
  theme?: t.CommonTheme;
};

/**
 * Component
 */
export type InfoProps = {
  enabled?: boolean;
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  clipboard?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onReady?: t.InfoStatusHandler;
  onChange?: t.InfoStatusHandler;
};

/**
 * Events
 */
export type InfoStatusHandler = (e: InfoStatusHandlerArgs) => void;
export type InfoStatusHandlerArgs = {
  readonly status: t.AuthStatus;
  readonly privy: t.PrivyInterface;
  readonly wallets: t.ConnectedWallet[];
  readonly accessToken?: string;
};

export type InfoChainSelectedHandler = (e: InfoChainSelectedHandlerArgs) => void;
export type InfoChainSelectedHandlerArgs = {
  readonly chain: t.EvmChainName;
};

export type InfoFarcasterClickHandler = (e: InfoFarcasterClickHandlerArgs) => void;
export type InfoFarcasterClickHandlerArgs = { user: Farcaster };
