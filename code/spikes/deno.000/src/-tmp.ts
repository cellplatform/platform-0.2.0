// import type * as t from '../../../ext/ext.lib.deno/src/t.deno.ts';

const m: t.DenoDeployment[] = [];
console.log('m', m);

/**
 * REF
 * https://docs.deno.com/runtime/tutorials/http_server
 */
const port = 8080;

const handler = (_req: Request): Response => {
  const body = 'hello world 👋';
  return new Response(body, { status: 200 });
};

console.log('HTTP server running at: http://localhost:8080/');
Deno.serve({ port }, handler);
