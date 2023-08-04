import { type t } from './common';

type Content = JSX.Element | false | null;

/**
 * Component
 */
export type SplitLayoutProps = {
  children?: [Content, Content];
  axis?: t.Axis;
  split?: t.Percent;
  min?: t.Percent;
  max?: t.Percent;
  debug?: boolean;
  style?: t.CssValue;
};

/**
 * Component: Property Editor
 */
export type SplitLayoutEditorProps = {
  enabled?: boolean;
  axis?: t.Axis;
  split?: t.Percent;
  min?: t.Percent;
  max?: t.Percent;
  style?: t.CssValue;
  onChange?: SplitLayoutEditorChangeHandler;
};

export type SplitLayoutEditorChangeHandler = (e: SplitLayoutEditorChangeHandlerArgs) => void;
export type SplitLayoutEditorChangeHandlerArgs = {
  axis: t.Axis;
  split: t.Percent;
};
