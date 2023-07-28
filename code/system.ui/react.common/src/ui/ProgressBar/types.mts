import { type t } from './common';

type Percent = number; // 0..1  ←(0=0%, 1=100%)

/**
 * Component
 */
export type ProgressBarProps = {
  percent?: Percent;
  thumbColor?: string;
  height?: number;
  style?: t.CssValue;
  onClick?: ProgressBarClickHandler;
};

/**
 * Events
 */
export type ProgressBarClickHandler = (e: ProgressBarClickHandlerArgs) => void;
export type ProgressBarClickHandlerArgs = {
  percent: Percent;
};
