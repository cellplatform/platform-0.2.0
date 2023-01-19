import type { t } from '../../common.t';

type Milliseconds = number;

export type PlaylistItem = {
  text: string | JSX.Element;
  duration?: Milliseconds;
};

export type PlaylistItemClickHandler = (e: PlaylistItemClickHandlerArgs) => void;
export type PlaylistItemClickHandlerArgs = {
  item: PlaylistItem;
  index: number;
};
