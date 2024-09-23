import { default as Pkg } from '../../deno.json' with { type: 'json' };


/**
 * @ext
 */
import { equals, uniq } from 'npm:ramda';
export const R = { equals , uniq};


/**
 * @module
 */
export type * as t from './t.ts';
export { Pkg };

