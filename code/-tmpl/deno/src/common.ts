import { default as Pkg } from '../deno.json' with { type: 'json' };

export { describe, expect, it } from '@sys/std/testing';

export type * as t from './t.ts';
export { Pkg };

