import { type t } from './common';

export type RootPropsFocused = 'index' | 'player.footer';

/**
 * Component
 */
export type RootProps = {
  vimeo?: t.VimeoInstance;
  slugs?: t.ConceptSlug[];
  selected?: number;
  focused?: RootPropsFocused;
  style?: t.CssValue;
  onSelect?: t.VideoConceptClickHandler;
  onPlayToggle?: t.ConceptPlayerHandler;
  onPlayComplete?: t.ConceptPlayerHandler;
};

export type RootStatefulProps = {
  slugs?: t.ConceptSlug[];
  style?: t.CssValue;
  onReady?: RootStatefulReadyHandler;
};

/**
 * Events
 */
export type RootStatefulReadyHandler = (e: RootStatefulReadyHandlerArgs) => void;
export type RootStatefulReadyHandlerArgs = {
  vimeo: t.VimeoInstance;
};

/**
 * Content
 */
export type VideoConceptClickHandler = (e: VideoConceptClickHandlerArgs) => void;
export type VideoConceptClickHandlerArgs = { index: number };
