import { type t } from './common';

export type IndexProps = {
  items?: t.SlugListItem[];
  selected?: t.Index;
  focused?: boolean;
  style?: t.CssValue;
  onSelect?: t.LayoutSelectHandler;
};
