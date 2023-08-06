import { type t } from './common';

export type IndexProps = {
  items?: t.SlugListItem[];
  selected?: t.Index;
  focused?: boolean;
  editing?: boolean;
  style?: t.CssValue;
  onSelect?: t.LayoutSelectHandler;
  onSlugEdited?: t.IndexSlugEditHandler;
};

/**
 * Events
 */

export type IndexSlugEditHandler = (e: IndexSlugEditHandlerArgs) => void;
export type IndexSlugEditHandlerArgs = {
  index: t.Index;
  title: string;
};
