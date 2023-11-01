import type { t } from './common';

/**
 * <Component>
 */
export type AvatarTrayProps = {
  size?: number;
  peer?: t.PeerModel;
  muted?: boolean;
  style?: t.CssValue;
  onChange?: t.PeerStreamChangeHandler;
};

export type AvatarTrayStream = {
  conn: t.PeerConnection;
  stream: MediaStream;
};

/**
 * Events
 */
export type PeerStreamChangeHandler = (e: PeerStreamChangeHandlerArgs) => void;
export type PeerStreamChangeHandlerArgs = {
  selected?: AvatarTrayStream;
};
