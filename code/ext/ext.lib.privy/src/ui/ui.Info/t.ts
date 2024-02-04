import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Refresh'
  | 'Id.User'
  | 'Id.User.Phone'
  | 'Id.App.Privy'
  | 'Id.App.WalletConnect'
  | 'Auth.Login'
  | 'Auth.Link.Wallet'
  | 'Wallet.List'
  | 'Wallet.List.Title'
  | 'Chain.List'
  | 'Chain.List.Title'
  | 'Chain.List.Testnets';

export type InfoData = {
  provider?: { appId?: string; walletConnectId?: string };
  chain?: {
    names?: t.EvmChainName[];
    selected?: t.EvmChainName;
    onSelected?: InfoChainSelectedHandler;
  };
  wallet?: {
    list?: { title?: string };
  };
};

export type InfoFieldModifiers = { keys: t.KeyboardModifierFlags; is: { over: boolean } };

/**
 * Component
 */
export type InfoProps = {
  enabled?: boolean;
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  clipboard?: boolean;
  flipped?: boolean;
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
