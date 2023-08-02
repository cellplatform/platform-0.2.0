import { type t } from './common';

export type SliderProps = {
  enabled?: boolean;
  percent?: t.Percent;
  track?: Partial<t.SliderTrackProps>;
  thumb?: Partial<t.SliderThumbProps>;
  style?: t.CssValue;
  onChange?: t.SliderTrackChangeHandler;
};

export type SliderTrackProps = {
  height: t.Pixels;
  defaultColor: string;
  progressColor: string;
  borderColor: string;
};

export type SliderThumbProps = {
  size: t.Pixels;
  color: string;
  pressedScale: t.Percent;
};

/**
 * Events
 */
export type SliderTrackChangeHandler = (e: SliderTrackChangeHandlerArgs) => void;
export type SliderTrackChangeHandlerArgs = { percent: t.Percent };
