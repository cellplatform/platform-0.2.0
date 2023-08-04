import { type t } from './common';

type Content = JSX.Element | false | null;

/**
 * Component
 */
export type SplitLayoutProps = {
  children?: [Content, Content];
  axis?: t.Axis;
  split?: t.Percent;
  splitMin?: t.Percent;
  splitMax?: t.Percent;
  debug?: boolean;
  style?: t.CssValue;
};

/**
 * Component: Property Editor
 */
export type SplitLayoutEditorProps = {
  enabled?: boolean;
  showAxis?: boolean;
  axis?: t.Axis;
  split?: t.Percent;
  splitMin?: t.Percent;
  splitMax?: t.Percent;
  style?: t.CssValue;
  onChange?: SplitLayoutEditorChangeHandler;
};

export type SplitLayoutEditorChangeHandler = (e: SplitLayoutEditorChangeHandlerArgs) => void;
export type SplitLayoutEditorChangeHandlerArgs = {
  axis: t.Axis;
  split: t.Percent;
};
