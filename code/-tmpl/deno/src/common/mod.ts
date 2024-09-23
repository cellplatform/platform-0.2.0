import { default as Pkg } from '../../deno.json' with { type: 'json' };

/**
 * @ext
 */
export { describe, expect, it } from '@sys/std/Testing';

/**
 * @module
 */
export type * as t from './t.ts';
export { Pkg };

