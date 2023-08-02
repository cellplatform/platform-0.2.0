import { type t } from './common';

export type SliderProps = {
  percent?: t.Percent;
  thumb?: t.SliderThumbProps;
  track?: t.SliderTrackProps;
  style?: t.CssValue;
};

export type SliderThumbProps = {
  height?: t.Pixels;
};

export type SliderTrackProps = {
  height?: t.Pixels;
};
