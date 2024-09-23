import { default as Pkg } from '../../deno.json' with { type: 'json' };

export { Http, Path } from '@sys/std';
export { describe, expect, it } from '@sys/std/Testing';

export type * as t from './t.ts';
export { Pkg };

