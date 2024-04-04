import type * as t from './t.ts';
export { type t };

/**
 * Libs
 */
export { Hono } from 'npm:hono';

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
