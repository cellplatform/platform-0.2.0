import type { t } from '../common/mod.ts';

/**
 * Testing helpers.
 */
export type Testing = {
  readonly Http: TestHttp;
};

export type TestHttp = {
  server(defaultHandler?: Deno.ServeHandler): t.TestHttpServer;
  json(body: unknown): Response;
  json(req: Request, body: unknown): Response;
};

/**
 * A test HTTP server.
 */
export type TestHttpServer = {
  readonly url: t.HttpUrl;
  readonly addr: Deno.NetAddr;
  readonly disposed: boolean;
  dispose(): Promise<void>;
};
