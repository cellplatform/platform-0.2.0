import { type t } from './common';

export type ScreenLayoutFocused = 'index' | 'player.footer';

/**
 * Component
 */
export type ScreenLayoutProps = {
  slugs?: t.ConceptSlug__[];
  selected?: number;
  focused?: ScreenLayoutFocused;
  style?: t.CssValue;
  onSelect?: t.ScreenLayoutSelectHandler;
  onPlayToggle?: t.PlayBarHandler;
  onPlayComplete?: t.PlayBarHandler;
};

export type ScreenLayoutStatefulProps = {
  slugs?: t.ConceptSlug__[];
  style?: t.CssValue;
  onReady?: ScreenLayoutStatefulReadyHandler;
};

/**
 * Events
 */
export type ScreenLayoutStatefulReadyHandler = (e: ScreenLayoutStatefulReadyHandlerArgs) => void;
export type ScreenLayoutStatefulReadyHandlerArgs = {
  vimeo: t.VimeoInstance;
};

/**
 * Content
 */
export type ScreenLayoutSelectHandler = (e: ScreenLayoutSelectHandlerArgs) => void;
export type ScreenLayoutSelectHandlerArgs = { index: number };
