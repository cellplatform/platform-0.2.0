import type { t } from '../common/mod.ts';
import type { describe, it } from '@std/testing/bdd';
import type { expect } from 'npm:chai';

/**
 * Testing helpers.
 */
export type Testing = {
  readonly Http: TestHttp;
  readonly Bdd: TestingBdd;
};

export type TestingBdd = {
  readonly expect: typeof expect;
  readonly describe: typeof describe;
  readonly it: typeof it;
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
