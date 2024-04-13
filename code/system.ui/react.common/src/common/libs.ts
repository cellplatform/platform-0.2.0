/**
 * @external
 */
import { clamp, clone, equals, flatten, mergeDeepRight, prop, sortBy, uniq } from 'ramda';
export const R = { clamp, clone, equals, flatten, mergeDeepRight, prop, sortBy, uniq } as const;

export { ErrorBoundary } from 'react-error-boundary';
export { Observable, Subject } from 'rxjs';

/**
 * @system
 */
export { Patch, PatchState } from 'sys.data.json';
export { Diff, Fuzzy, Text } from 'sys.text';
export {
  Delete,
  Filesize,
  Hash,
  Is,
  ObjectPath,
  Percent,
  Sheet,
  Time,
  Value,
  asArray,
  cuid,
  rx,
  slug,
} from 'sys.util';

/**
 * @system → UI
 */
export { File, KeyboardMonitor, LocalStorage, UserAgent } from 'sys.ui.dom';
export { Color, Style, css } from 'sys.ui.react.css';
export { useRubberband } from 'sys.ui.react.dev';
export { FC, useClickInside, useClickOutside, useMouse } from 'sys.ui.react.util';
