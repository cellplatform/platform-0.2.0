import type * as t from './types.mjs';

export { t };

export const COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  DARK: '#293042', // Inky blue/black.
  CYAN: '#00C2FF',
  MAGENTA: '#FE0064',
  BLUE: '#4D7EF7',
};

/**
 * @external
 */
import { clone, equals, groupBy, prop, sortBy, uniq } from 'ramda';
export const R = { clone, equals, groupBy, prop, sortBy, uniq };

/**
 * @system
 */
export { FC } from 'sys.util.react';
export { rx, slug, Is } from 'sys.util';
export { css, Color, Style } from 'sys.util.css';
