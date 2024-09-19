import { default as Pkg } from '../../deno.json' with { type: 'json' };

/**
 * @ext
 */
export * from '@sys/std';
export * from './libs.ts';

export * as DotEnv from '@std/dotenv';
export { Testing, describe, expect, it } from '@sys/std/testing';


/**
 * @module
 */
export type * as t from './t.ts';
export { Pkg };

