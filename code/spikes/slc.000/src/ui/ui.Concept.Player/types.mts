import { type t } from './common';

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
  onPlayToggle?: ConceptPlayerHandler;
  onPlayComplete?: ConceptPlayerHandler;
};

/**
 * Events
 */
export type ConceptPlayerHandler = (e: ConceptPlayerHandlerArgs) => void;
export type ConceptPlayerHandlerArgs = {
  status: t.VimeoStatus;
};
