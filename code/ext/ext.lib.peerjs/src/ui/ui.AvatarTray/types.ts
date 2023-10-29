import type { t } from './common';

/**
 * <Component>
 */
export type AvatarTrayProps = {
  size?: number;
  peer?: t.PeerModel;
  style?: t.CssValue;
  onClick?: t.PeerStreamClickHandler;
};

/**
 * Events
 */
export type PeerStreamClickHandler = (e: PeerStreamClickHandlerArgs) => void;
export type PeerStreamClickHandlerArgs = {
  conn: t.PeerConnection;
  stream: MediaStream;
};
