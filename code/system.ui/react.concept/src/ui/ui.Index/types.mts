import { type t } from './common';

export type IndexProps = {
  items?: t.SlugListItem[];
  selected?: t.Index;
  focused?: boolean;
  editing?: boolean;
  scroll?: boolean;
  style?: t.CssValue;
  onSelect?: t.LayoutSelectHandler;
  onSlugEditStart?: t.IndexSlugEditStartHandler;
  onSlugEditComplete?: t.IndexSlugEditCompleteHandler;
};

/**
 * Events
 */
export type IndexSlugEditStartHandler = (e: IndexSlugEditStartHandlerArgs) => void;
export type IndexSlugEditStartHandlerArgs = { index: t.Index };

export type IndexSlugEditCompleteHandler = (e: IndexSlugEditCompleteHandlerArgs) => void;
export type IndexSlugEditCompleteHandlerArgs = {
  index: t.Index;
  title: string;
};
