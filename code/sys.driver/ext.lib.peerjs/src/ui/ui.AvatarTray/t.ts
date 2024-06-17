import type { t } from './common';

/**
 * <Component>
 */
export type AvatarTrayProps = {
  peer?: t.PeerModel;
  selected?: MediaStream;
  muted?: boolean;
  size?: number;
  gap?: t.Pixels;
  borderRadius?: t.Pixels;
  emptyMessage?: string | JSX.Element;
  margin?: t.MarginInput;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onSelection?: t.PeerStreamSelectionHandler;
  onTotalChanged?: AvatarTrayTotalChangedHandler;
};

/**
 * Events
 */
export type PeerStreamSelectionHandler = (e: PeerStreamSelectionHandlerArgs) => void;
export type PeerStreamSelectionHandlerArgs = {
  readonly total: number;
  readonly peer: t.PeerModel;
  readonly selected?: MediaStream;
};

export type AvatarTrayTotalChangedHandler = (e: AvatarTrayTotalChangedHandlerArgs) => void;
export type AvatarTrayTotalChangedHandlerArgs = {
  readonly total: number;
  readonly peer: t.PeerModel;
};
