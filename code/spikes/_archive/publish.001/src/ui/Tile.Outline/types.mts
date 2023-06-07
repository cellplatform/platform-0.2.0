import type { t } from '../common.t';

export type RenderTileInner = (args: RenderTileInnerArgs) => JSX.Element | null;
export type RenderTileInnerArgs = {
  index: number;
  text: string;
  node: t.MdastNode;
};

export type TileClickHandler = (e: TileClickHandlerArgs) => void;
export type TileClickHandlerArgs = {
  ref?: { text: string; url: string };
  heading: { node: t.MdastHeading; title: string };
  child?: {
    node: t.MdastListItem;
    title: string;
  };
};
