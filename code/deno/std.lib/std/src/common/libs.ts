import { default as Pkg } from '../../deno.json' with { type: 'json' };


/**
 * @ext
 */
import { equals } from 'npm:ramda';
export const R = { equals };


/**
 * @module
 */
export type * as t from './t.ts';
export { Pkg };

