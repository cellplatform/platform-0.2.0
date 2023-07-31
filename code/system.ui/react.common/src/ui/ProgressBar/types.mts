import { type t } from './common';

/**
 * Component
 */
export type ProgressBarProps = {
  percent?: t.Percent;
  buffered?: t.Percent;
  thumbColor?: string;
  bufferedColor?: string;
  height?: number;
  style?: t.CssValue;
  onClick?: ProgressBarClickHandler;
};

/**
 * Events
 */
export type ProgressBarClickHandler = (e: ProgressBarClickHandlerArgs) => void;
export type ProgressBarClickHandlerArgs = {
  percent: t.Percent;
};
