import { type t } from '../common.t';

export type PeerIdProps = {
  peer?: t.PeerId | t.PeerUri;
  abbreviate?: boolean | number | [number, number];
  prefix?: string;
  fontSize?: number;
  enabled?: boolean;
  copyable?: boolean;
  style?: t.CssValue;
  onClick?: PeerIdClickHandler;
};

/**
 * Events
 */
export type PeerIdClickHandler = (e: PeerIdClickHandlerArgs) => void;
export type PeerIdClickHandlerArgs = {
  readonly id: t.PeerId;
  readonly uri: t.PeerUri;
  copy(): t.PeerId;
};
