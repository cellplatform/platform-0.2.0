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
export type PlayBarProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
  download?: t.DownloadFileProps;
  style?: t.CssValue;
  onPlayToggle?: PlayBarHandler;
  onPlayComplete?: PlayBarHandler;
};

/**
 * Events
 */
export type PlayBarHandler = (e: PlayBarHandlerArgs) => void;
export type PlayBarHandlerArgs = {
  status: t.VimeoStatus;
};
