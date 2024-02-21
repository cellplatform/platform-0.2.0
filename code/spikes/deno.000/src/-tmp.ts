/**
 * REF
 * https://docs.deno.com/runtime/tutorials/http_server
 */
const port = 8080;

const handler = (request: Request): Response => {
  const body = 'hello world 👋';
  return new Response(body, { status: 200 });
};

console.log('HTTP server running at: http://localhost:8080/');
Deno.serve({ port }, handler);
