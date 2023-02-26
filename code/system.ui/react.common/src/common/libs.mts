/**
 * @external
 */

export { Observable, Subject } from 'rxjs';

import { clone, equals, mergeDeepRight, uniq, clamp } from 'ramda';
export const R = { clone, equals, mergeDeepRight, uniq, clamp };

/**
 * @system
 */
export { FC, useMouseState } from 'sys.ui.react.util';
export { rx, slug, cuid, Is, Time, Value, Delete } from 'sys.util';
export { css, Color, Style } from 'sys.ui.react.css';
export { LocalStorage, Keyboard } from 'sys.ui.dom';
export { Text } from 'sys.text';
