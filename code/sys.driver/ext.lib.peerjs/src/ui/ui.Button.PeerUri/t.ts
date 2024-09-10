import type { t } from './common';

/**
 * <Component>
 */
export type PeerUriButtonProps = {
  id?: string;
  prefix?: string;
  fontSize?: number;
  bold?: boolean;
  monospace?: boolean;
  clipboard?: boolean;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: t.PeerUriHandler;
};

/**
 * Events
 */
export type PeerUriHandler = (e: PeerUriHandlerArgs) => void;
export type PeerUriHandlerArgs = {
  readonly id: string;
  readonly prefix: string;
  readonly uri: string;
};
