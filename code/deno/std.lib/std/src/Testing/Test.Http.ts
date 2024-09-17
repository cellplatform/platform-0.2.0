import { type t } from './common.ts';
import { TestServer } from './Test.Http.Server.ts';

/**
 * HTTP test helpers.
 */
export const TestHttp: t.TestHttp = {
  /**
   * Factory: create and start an HTTP test server.
   */
  server: TestServer.create,

  json(...args: any[]) {
    const req = args.length === 2 ? args[0] : undefined;
    const body = args.length === 2 ? args[1] : args[0];

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (req?.url) headers['X-Request-URL'] = req?.url;
    return new Response(JSON.stringify(body), { headers });
  },
} as const;
