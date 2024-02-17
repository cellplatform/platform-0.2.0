import OpenAI from 'npm:openai';
export { OpenAI };

// Hono.
// https://hono.dev
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts';
export const Server = { Hono, cors, serveStatic };

// Ramda.
import { uniq } from 'npm:ramda';
export const R = { uniq } as const;
