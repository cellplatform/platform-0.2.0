import type { t } from '../common/mod.ts';

/**
 * Testing helpers.
 */
export type Testing = {
  readonly Http: {
    server(defaultHandler?: Deno.ServeHandler): t.TestingHttp;
  };
};

/**
 * A test HTTP server.
 */
export type TestingHttp = {
  readonly url: t.HttpUrl;
  readonly addr: Deno.NetAddr;
  readonly disposed: boolean;
  dispose(): Promise<void>;
};
