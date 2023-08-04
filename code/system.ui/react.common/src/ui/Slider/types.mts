import { type t } from './common';

/**
 * Component
 */
export type SliderProps = {
  enabled?: boolean;
  width?: number;
  percent?: t.Percent;
  track?: Partial<t.SliderTrackProps>;
  thumb?: Partial<t.SliderThumbProps>;
  ticks?: Partial<t.SliderTickProps>;
  style?: t.CssValue;
  onChange?: t.SliderTrackChangeHandler;
};

/**
 * Slider → Track
 */
export type SliderTrackProps = {
  height: t.Pixels;
  defaultColor: string;
  highlightColor: string;
  borderColor: string;
};

/**
 * Slider → Thumb
 */
export type SliderThumbProps = {
  size: t.Pixels;
  color: string;
  pressedScale: number; // eg: 1.1
};

/**
 * Slider → Tick Marks
 */
export type SliderTickProps = {
  offset: { top: t.Pixels; bottom: t.Pixels };
  items: SliderTickInput[];
};

export type SliderTickInput = t.Percent | SliderTick | undefined | false;
export type SliderTick = {
  value: t.Percent;
  label?: string;
  el?: JSX.Element | false;
};

/**
 * Events
 */
export type SliderTrackChangeHandler = (e: SliderTrackChangeHandlerArgs) => void;
export type SliderTrackChangeHandlerArgs = { percent: t.Percent };
