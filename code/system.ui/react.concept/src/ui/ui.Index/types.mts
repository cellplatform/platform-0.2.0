import { type t } from './common';

export type IndexProps = {
  items?: t.SlugListItem[];
  selected?: t.Index;
  focused?: boolean;
  editing?: boolean;
  scroll?: boolean;
  style?: t.CssValue;
  padding?: t.CssEdgesInput;
  margin?: t.CssEdgesInput;
  onSelect?: t.IndexSelectHandler;
  onSlugEditStart?: t.IndexSlugEditStartHandler;
  onSlugEditComplete?: t.IndexSlugEditCompleteHandler;
};

/**
 * Events
 */
export type IndexSlugEditStartHandler = (e: IndexSlugEditStartHandlerArgs) => void;
export type IndexSlugEditStartHandlerArgs = { index: t.Index };

export type IndexSlugEditCompleteHandler = (e: IndexSlugEditCompleteHandlerArgs) => void;
export type IndexSlugEditCompleteHandlerArgs = { index: t.Index; title: string };

export type IndexSelectHandler = (e: IndexSelectHandlerArgs) => void;
export type IndexSelectHandlerArgs = { index: number };
