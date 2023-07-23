import { type t } from './common';

type Percent = number; // 0..1

/**
 * Component
 */
export type SeekBarProps = {
  progress?: Percent;
  style?: t.CssValue;
};
