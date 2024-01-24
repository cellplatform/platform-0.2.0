/**
 * @external
 */
import { clamp, equals, uniq } from 'ramda';
export const R = { uniq, equals, clamp } as const;

/**
 * @ext
 */
export { Doc, Store, WebStore, toObject } from 'ext.lib.automerge';

/**
 * @system
 */
export { Card, Color, FC, Style, css } from 'sys.ui.react.common';
export { Time, Value, rx } from 'sys.util';
