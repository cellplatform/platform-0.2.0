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
  onPlayToggle?: t.PlayBarHandler;
  onPlayComplete?: t.PlayBarHandler;
};

export type LayoutStatefulProps = {
  slugs?: t.SlugListItem[];
  style?: t.CssValue;
  onReady?: LayoutStatefulReadyHandler;
};

/**
 * Events
 */
export type LayoutStatefulReadyHandler = (e: LayoutStatefulReadyHandlerArgs) => void;
export type LayoutStatefulReadyHandlerArgs = {};

/**
 * Content
 */
export type LayoutSelectHandler = (e: LayoutSelectHandlerArgs) => void;
export type LayoutSelectHandlerArgs = { index: number };
