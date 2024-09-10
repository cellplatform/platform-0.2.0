/**
 * @external
 */
import { clamp, clone, equals, flatten, mergeDeepRight, prop, sortBy, uniq } from 'ramda';
export const R = { clamp, clone, equals, flatten, mergeDeepRight, prop, sortBy, uniq } as const;

export { ErrorBoundary } from 'react-error-boundary';
export { Observable, Subject } from 'rxjs';

/**
 * @ext.lib
 */
export { Patch, PatchState } from 'ext.lib.immer';

/**
 * @system
 */
export { Cmd } from 'sys.cmd';
export { Diff, Fuzzy, Text } from 'sys.data.text';
export {
  Args,
  asArray,
  cuid,
  Delete,
  Filesize,
  Hash,
  Immutable,
  Is,
  Json,
  ObjectPath,
  Percent,
  rx,
  Sheet,
  slug,
  Time,
  Value,
} from 'sys.util';

/**
 * @system → UI
 */
export { File, KeyboardMonitor, LocalStorage, UserAgent } from 'sys.ui.dom';
export { Color, css, Style } from 'sys.ui.react.css';
export { BADGES, useRubberband } from 'sys.ui.react.dev';
export { FC, ReactEvent, useClickInside, useClickOutside, useMouse } from 'sys.ui.react.util';
