import { type t } from '../common';

export type ObjectViewTheme = 'Light' | 'Dark';

export type ObjectViewProps = {
  name?: string;
  data?: any;
  expand?: number | { level?: number; paths?: string[] | boolean };
  showNonenumerable?: boolean;
  showRootSummary?: boolean;
  sortObjectKeys?: boolean;
  fontSize?: number;
  theme?: t.ObjectViewTheme;
  style?: t.CssValue;
};
