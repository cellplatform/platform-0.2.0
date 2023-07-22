import { type t } from '../common';

type Url = string;

export type VimeoIconClickArgs = { icon: t.VimeoIconFlag };

/**
 * Component: Player
 */
export type VimeoPlayerProps = {
  instance?: t.VimeoInstance;
  video?: number;
  muted?: boolean;
  width?: number;
  height?: number;
  borderRadius?: number;
  scale?: number;
  icon?: t.VimeoIconFlag;
  thumbnail?: Url;
  style?: t.CssValue;
  onIconClick?: (e: t.VimeoIconClickArgs) => void;
};

/**
 * Component: Background
 */
export type VimeoBackgroundProps = {
  instance?: t.VimeoInstance;
  video?: number;
  opacity?: number;
  blur?: number;
  opacityTransition?: number; // msecs
};
