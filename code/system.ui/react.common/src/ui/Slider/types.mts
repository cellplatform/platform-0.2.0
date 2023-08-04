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
  percent?: t.Percent; // If present, overrides the parent "percent" prop.
  color: { default: string; highlight: string; border: string };
};

/**
 * Slider → Thumb
 */
export type SliderThumbProps = {
  size: t.Pixels;
  opacity: t.Percent;
  pressedScale: number; // eg: 1.1
  color: { default: string; border: string };
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
