/**
 * @external
 */
export { Observable, Subject } from 'rxjs';

import { mergeDeepRight, clone, equals } from 'ramda';
export const R = { mergeDeepRight, clone, equals };

/**
 * @system
 */
export { FC, useMouseState } from 'sys.ui.react';
export { rx, slug, Is, Time, Value } from 'sys.util';
export { css, Color, Style } from 'sys.ui.react.css';
export { LocalStorage } from 'sys.ui.dom';
