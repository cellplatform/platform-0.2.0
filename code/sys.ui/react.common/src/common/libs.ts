/**
 * @external
 */
import { clamp, clone, equals, flatten, mergeDeepRight, prop, sortBy, uniq } from 'ramda';
export const R = { clamp, clone, equals, flatten, mergeDeepRight, prop, sortBy, uniq } as const;

export { ErrorBoundary } from 'react-error-boundary';
export { Observable, Subject } from 'rxjs';

export { Patch, PatchState } from 'ext.lib.immer';

import minimist from 'minimist';
export { minimist };

/**
 * @system
 */
export { Cmd } from 'sys.cmd';
export { Diff, Fuzzy, Text } from 'sys.data.text';
export {
  Delete,
  Filesize,
  Hash,
  Immutable,
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
export { BADGES, useRubberband } from 'sys.ui.react.dev';
export { FC, ReactEvent, useClickInside, useClickOutside, useMouse } from 'sys.ui.react.util';
