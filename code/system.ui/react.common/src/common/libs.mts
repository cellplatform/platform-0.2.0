/**
 * @external
 */
import { clamp, clone, equals, mergeDeepRight, prop, sortBy, uniq } from 'ramda';
export const R = { clone, equals, mergeDeepRight, uniq, clamp, prop, sortBy } as const;
export { Observable, Subject } from 'rxjs';

/**
 * @system
 */
export { Diff, Fuzzy, Text } from 'sys.text';
export { Delete, Hash, Is, Time, Value, cuid, rx, slug, Sheet, asArray } from 'sys.util';
export { Patch, PatchState } from 'sys.data.json';

/**
 * @system → UI
 */
export { KeyboardMonitor, LocalStorage, UserAgent } from 'sys.ui.dom';
export { Color, Style, css } from 'sys.ui.react.css';
export { FC, useClickInside, useClickOutside, useMouseState } from 'sys.ui.react.util';
