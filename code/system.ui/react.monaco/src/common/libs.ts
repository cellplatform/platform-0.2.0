/**
 * @external
 */
import { uniq, equals, clamp } from 'ramda';
export const R = { uniq, equals, clamp } as const;

/**
 * @system
 */
export { rx, Value } from 'sys.util';
export { FC, Color, css, Card, Style } from 'sys.ui.react.common';
