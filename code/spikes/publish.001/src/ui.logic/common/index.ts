import type * as t from './types.mjs';
import { Text } from 'sys.text';
export { t };

/**
 * @external
 */
import { clamp, clone, equals, groupBy, prop, sortBy, uniq, mergeDeepRight } from 'ramda';
export const R = { clamp, clone, equals, groupBy, prop, sortBy, uniq, mergeDeepRight };

/**
 * @system
 */
export const Processor = Text.Markdown.processor();
export { Text };
export { rx, slug, Path, Time, Is, Value } from 'sys.util';
export { FC } from 'sys.ui.react';
export { Patch, Json } from 'sys.data.json';

export { Filesystem } from 'sys.fs.indexeddb';
export { TestFilesystem } from 'sys.fs';

/**
 * WARNING - be careful these external references do not blow-up the bundle size.
 */
export { BundlePaths } from 'sys.pkg';

/**
 * @local
 */
export { Pkg } from '../../index.pkg.mjs';
