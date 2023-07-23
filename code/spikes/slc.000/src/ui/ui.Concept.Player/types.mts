import { type t } from './common';

export type ConceptPlayerProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
  style?: t.CssValue;
};

/**
 *
 * TODO: Move to sys.ui.media.Vimeo
 *
 */
export type VimeoPlayer = {
  readonly ready: boolean;
  readonly events?: t.VimeoEvents;
  readonly status?: t.VimeoStatus;
  readonly playing: boolean;
  play(): void;
  pause(): void;
  toggle(): void;
};
