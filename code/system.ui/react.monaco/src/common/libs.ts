/**
 * @external
 */
import { uniq, equals, clamp } from 'ramda';
export const R = { uniq, equals, clamp } as const;

/**
 * @ext
 */
export { Doc, Store, WebStore, toObject } from 'ext.lib.automerge';

/**
 * @system
 */
export { rx, Value } from 'sys.util';
export { FC, Color, css, Card, Style } from 'sys.ui.react.common';
