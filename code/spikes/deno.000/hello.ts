/**
 * https://docs.deno.com/runtime/manual
 * https://examples.deno.land/
 *
 * demo run -A hello.ts
 */
Deno.serve((_req: Request) => {
  return new Response('Hello, world!');
});
