import { type t } from './common';

type Content = JSX.Element | false | null;

export type SplitLayoutProps = {
  children?: [Content, Content];
  axis?: t.Axis;
  split?: t.Percent;
  debug?: boolean;
  style?: t.CssValue;
};
