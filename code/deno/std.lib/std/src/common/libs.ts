import { default as Pkg } from '../../deno.json' with { type: 'json' };


/**
 * @ext
 */
import { clone, equals, uniq } from 'npm:ramda';
export const R = { clone, equals , uniq};


/**
 * @module
 */
export type * as t from './t.ts';
export { Pkg };

