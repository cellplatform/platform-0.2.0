/**
 * @external
 */

export { Observable, Subject } from 'rxjs';

import { clone, equals, mergeDeepRight, uniq, clamp, prop, sortBy } from 'ramda';
export const R = { clone, equals, mergeDeepRight, uniq, clamp, prop, sortBy };

/**
 * @system
 */
export { FC, useMouseState, useClickOutside, useClickInside } from 'sys.ui.react.util';
export { rx, slug, cuid, Is, Time, Value, Delete, Hash } from 'sys.util';
export { css, Color, Style } from 'sys.ui.react.css';
export { LocalStorage, UserAgent, KeyboardMonitor } from 'sys.ui.dom';
export { Text, Fuzzy, Diff } from 'sys.text';
