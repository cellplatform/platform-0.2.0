export type * from './route.deno/t.ts';
export type * from './route.openai/t.ts';

/**
 * Web server.
 */
import type { Hono } from 'npm:hono';
import type { Env, BlankSchema } from 'npm:hono/types';

export type { BlankSchema } from 'npm:hono/types';
export type HonoApp = Hono<Env, BlankSchema, '/'>;
