/**
 * @external
 */
import { clamp, clone, equals, mergeDeepRight, prop, sortBy, uniq } from 'ramda';
export const R = { clone, equals, mergeDeepRight, uniq, clamp, prop, sortBy } as const;
export { Observable, Subject } from 'rxjs';

/**
 * @system
 */
export { Patch, PatchState } from 'sys.data.json';
export { Diff, Fuzzy, Text } from 'sys.text';
export { Delete, Hash, Is, Sheet, Time, Value, asArray, cuid, rx, slug } from 'sys.util';

/**
 * @system → UI
 */
export { KeyboardMonitor, LocalStorage, UserAgent } from 'sys.ui.dom';
export { Color, Style, css } from 'sys.ui.react.css';
export { useRubberband } from 'sys.ui.react.dev';
export { FC, useClickInside, useClickOutside, useMouse } from 'sys.ui.react.util';
