/**
 * Standard Lib.
 */
import { join, dirname, resolve } from 'https://deno.land/std@0.142.0/path/mod.ts';
import { exists } from 'https://deno.land/std/fs/mod.ts';
export const Path = { join, dirname, resolve, exists } as const;

// Hono
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { serveStatic } from 'https://deno.land/x/hono@v4.0.3/middleware.ts';
export const Server = { Hono, cors, serveStatic } as const;

// Ramda
import { uniq } from 'npm:ramda';
export const R = { uniq } as const;
