import type { t } from '../common/mod.ts';

/**
 * Testing helpers.
 */
export type Testing = {
  http(defaultHandler?: Deno.ServeHandler): t.TestingHttp;
};

/**
 * A test HTTP server.
 */
export type TestingHttp = {
  readonly url: t.HttpUrl;
  readonly addr: Deno.NetAddr;
  readonly disposed: boolean;
  dispose(): Promise<void>;
  get(handler: Deno.ServeHandler): t.TestingHttp;
  put(handler: Deno.ServeHandler): t.TestingHttp;
  post(handler: Deno.ServeHandler): t.TestingHttp;
  delete(handler: Deno.ServeHandler): t.TestingHttp;
};
