// export type * from '../src/t.deno.ts';
export type * from '../../../ext/ext.lib.deno/src/t.deno.ts';

export type * from './r.subhosting/t.ts';

/**
 * Web server
 * https://hono.dev/api
 */
import type { Hono } from 'npm:hono';
import type { Env, BlankSchema } from 'npm:hono/types';
export type HonoApp = Hono<Env, BlankSchema, '/'>;
