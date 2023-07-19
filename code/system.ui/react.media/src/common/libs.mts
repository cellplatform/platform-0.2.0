/**
 * @external
 */
import { clamp, mergeDeepRight, prop, sortBy } from 'ramda';
export const R = { clamp, mergeDeepRight, prop, sortBy };

/**
 * @system
 */
export { Path } from 'sys.fs';
export {
  Color,
  FC,
  IFrame,
  ObjectView,
  ProgressBar,
  Style,
  TextInput,
  css,
  useSizeObserver,
} from 'sys.ui.react.common';
export { Delete, Time, Value, cuid, rx, slug } from 'sys.util';
export { File } from 'sys.ui.dom';
