import { type t } from './common';

export type LayoutFocused = 'index' | 'player.footer';

/**
 * Component
 */
export type LayoutProps = {
  slugs?: t.SlugListItem[];
  selected?: number;
  focused?: LayoutFocused;
  style?: t.CssValue;
  onSelect?: t.LayoutSelectHandler;
  onVideo?: t.LayoutVideoHandler;
};

export type LayoutStatefulProps__ = {
  slugs?: t.SlugListItem[];
  style?: t.CssValue;
  onReady?: LayoutStatefulReadyHandler;
};

export type LayoutVideoState = {
  status?: t.VideoStatus;
  playing?: boolean;
  timestamp?: number;
  muted?: boolean;
};

/**
 * Events
 */
export type LayoutStatefulReadyHandler = (e: LayoutStatefulReadyHandlerArgs) => void;
export type LayoutStatefulReadyHandlerArgs = {};

export type LayoutSelectHandler = (e: LayoutSelectHandlerArgs) => void;
export type LayoutSelectHandlerArgs = { index: number };

export type LayoutVideoHandler = (e: LayoutVideoHandlerArgs) => void;
export type LayoutVideoHandlerArgs = t.LayoutVideoState;
