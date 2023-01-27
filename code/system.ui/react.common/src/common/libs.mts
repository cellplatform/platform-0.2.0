/**
 * @external
 */

export { Observable, Subject } from 'rxjs';

import { clone, equals, mergeDeepRight, uniq } from 'ramda';
export const R = { clone, equals, mergeDeepRight, uniq };

/**
 * @system
 */
export { FC, useMouseState } from 'sys.ui.react.util';
export { rx, slug, Is, Time, Value } from 'sys.util';
export { css, Color, Style } from 'sys.ui.react.css';
export { LocalStorage } from 'sys.ui.dom';
