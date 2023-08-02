import { type t } from './common';

export type SliderProps = {
  enabled?: boolean;
  percent?: t.Percent;
  track?: t.SliderTrackProps;
  thumb?: t.SliderThumbProps;
  style?: t.CssValue;
  onChange?: t.SliderTrackChangeHandler;
};

export type SliderTrackProps = {
  height?: t.Pixels;
};

export type SliderThumbProps = {
  size?: t.Pixels;
  color?: string;
};

/**
 * Events
 */
export type SliderTrackChangeHandler = (e: SliderTrackChangeHandlerArgs) => void;
export type SliderTrackChangeHandlerArgs = { percent: t.Percent };
