import { Hono, cors, serveStatic, type t } from './common.ts';
import { create } from './u.Server.create.ts';
import { print, options } from './u.ts';

/**
 * Server Lib.
 */
export const Server: t.Server = {
  Hono,
  cors,
  static: serveStatic,
  create,
  print,
  options,
} as const;
