import type * as t from './t.ts';
export { type t };

/**
 * Libs
 */
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
export const Server = { Hono, cors } as const;

/**
 * Helpers
 */
export function statusOK(input: number | Response) {
  const status = typeof input === 'number' ? input : input.status;
  return (status || 0).toString().startsWith('2');
}

export const Time = {
  wait(delay: t.Msecs) {
    return new Promise<void>((resolve) => setTimeout(resolve, delay));
  },
} as const;
