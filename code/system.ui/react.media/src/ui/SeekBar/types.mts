import { type t } from './common';

type Percent = number; // 0..1

/**
 * Component
 */
export type SeekBarProps = {
  progress?: Percent;
  thumbColor?: string;
  style?: t.CssValue;
  onClick?: SeekBarClickHandler;
};

/**
 * Events
 */
export type SeekBarClickHandler = (e: SeekBarClickHandlerArgs) => void;
export type SeekBarClickHandlerArgs = {
  progress: Percent;
};
