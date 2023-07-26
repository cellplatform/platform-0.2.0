/**
 * @external
 */
import { clamp, mergeDeepRight, prop, sortBy } from 'ramda';
export const R = { clamp, mergeDeepRight, prop, sortBy } as const;

/**
 * @system
 */
export { Path } from 'sys.fs';
export { Delete, Time, Value, cuid, rx, slug } from 'sys.util';

/**
 * @system → UI
 */
export { File } from 'sys.ui.dom';
export {
  Color,
  FC,
  IFrame,
  ObjectView,
  ProgressBar,
  Style,
  TextInput,
  css,
  useMouseState,
  useSizeObserver,
} from 'sys.ui.react.common';
