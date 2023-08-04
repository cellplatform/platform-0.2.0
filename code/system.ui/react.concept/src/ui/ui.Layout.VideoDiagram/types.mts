import { type t } from './common';

export type VideoDiagramLayoutProps = {
  split?: t.Percent;
  splitMin?: t.Percent;
  splitMax?: t.Percent;
  debug?: boolean;
  style?: t.CssValue;
};
