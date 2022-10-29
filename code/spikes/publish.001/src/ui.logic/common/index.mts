import type * as t from './types.mjs';
export { t };

/**
 * @external
 */
import { groupBy, prop, sortBy, uniq, clone } from 'ramda';
export const R = { groupBy, prop, sortBy, uniq, clone };

/**
 * @system
 */
export { rx, slug, Path, Time } from 'sys.util';
export { FC } from 'sys.util.react';
export { css, Color, Style } from 'sys.util.css';
export { Patch } from 'sys.data.json';
export { Json } from 'sys.data.json';

/**
 * WARNING - be careful these external references do not blow-up the bundle size.
 */
export { BundlePaths } from '../../Pkg/Paths.mjs';

/**
 * @local
 */
export { Pkg } from '../../index.pkg.mjs';
