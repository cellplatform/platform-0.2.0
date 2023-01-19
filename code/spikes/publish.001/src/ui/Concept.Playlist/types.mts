import type { t } from '../../common.t';

type Seconds = number;

export type PlaylistItem = {
  text: string | JSX.Element;
  link?: string;
  secs?: Seconds;
};

export type PlaylistItemClickHandler = (e: PlaylistItemClickHandlerArgs) => void;
export type PlaylistItemClickHandlerArgs = {
  index: number;
  data: PlaylistItem;
};
