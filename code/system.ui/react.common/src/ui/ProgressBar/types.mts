import { type t } from './common';

type Percent = number; // 0..1

/**
 * Component
 */
export type ProgressBarProps = {
  percent?: Percent;
  thumbColor?: string;
  height?: number;
  style?: t.CssValue;
  onClick?: ProgressBarPropsClickHandler;
};

/**
 * Events
 */
export type ProgressBarPropsClickHandler = (e: ProgressBarPropsClickHandlerArgs) => void;
export type ProgressBarPropsClickHandlerArgs = {
  percent: Percent;
};
