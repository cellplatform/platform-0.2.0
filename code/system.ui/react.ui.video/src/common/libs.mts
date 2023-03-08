/**
 * @external
 */
import { clamp, mergeDeepRight, prop, sortBy } from 'ramda';
export const R = { clamp, mergeDeepRight, prop, sortBy };

/**
 * @system
 */
export { rx, slug, cuid, Time, Delete, Value } from 'sys.util';
export { Path } from 'sys.fs';
export {
  FC,
  IFrame,
  TextInput,
  css,
  Color,
  Style,
  ObjectView,
  useSizeObserver,
} from 'sys.ui.react.common';
