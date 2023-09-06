import type { t } from './common';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
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
};

export type InfoChainSelectedHandler = (e: InfoChainSelectedHandlerArgs) => void;
export type InfoChainSelectedHandlerArgs = { chain: t.EvmChainName };

export type InfoFieldModifiers = { keys: t.KeyboardModifierFlags; is: { over: boolean } };

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
  readonly accessToken?: string;
};
