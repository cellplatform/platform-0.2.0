import type { t } from '../../common.t';

type UrlString = string;
type Seconds = number;

/**
 * Header "preview" configuration.
 */
export type PlaylistPreview = { image?: UrlString; title?: string };

/**
 * Single item within a playlist.
 */
export type PlaylistItem = {
  text: string | JSX.Element;
  link?: string;
  secs?: Seconds;
};

/**
 * Playlist item click handler.
 */
export type PlaylistItemClickHandler = (e: PlaylistItemClickHandlerArgs) => void;
export type PlaylistItemClickHandlerArgs = {
  index: number;
  data: PlaylistItem;
};
