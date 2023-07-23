import { type t } from './common';

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
  seek(seconds: number): void;
};

export type DownloadFileProps = {
  kind: 'pdf';
  url: string;
  filename: string;
  onClick?: (e: { url: string; mimetype: string }) => void;
};

/**
 * Component
 */
export type ConceptPlayerProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
  download?: t.DownloadFileProps;
  style?: t.CssValue;
  onComplete?: ConceptPlayerCompleteHandler;
};

/**
 * Events
 */
export type ConceptPlayerCompleteHandler = (e: ConceptPlayerCompleteHandlerArgs) => void;
export type ConceptPlayerCompleteHandlerArgs = {
  status: t.VimeoStatus;
};
