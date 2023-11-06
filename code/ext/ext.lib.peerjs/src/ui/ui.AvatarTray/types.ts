import type { t } from './common';

/**
 * <Component>
 */
export type AvatarTrayProps = {
  size?: number;
  peer?: t.PeerModel;
  muted?: boolean;
  emptyMessage?: string | JSX.Element;
  style?: t.CssValue;
  onSelection?: t.PeerStreamSelectionHandler;
};

/**
 * Events
 */
export type PeerStreamSelectionHandler = (e: PeerStreamSelectionHandlerArgs) => void;
export type PeerStreamSelectionHandlerArgs = {
  peer: t.PeerModel;
  selected?: MediaStream;
};
