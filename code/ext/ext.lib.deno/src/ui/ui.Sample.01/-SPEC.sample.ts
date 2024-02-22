export const code = `
const handler = (req: Request): Response => {
  const body = 'hello world 👋';
  return new Response(body, { status: 200 });
};

console.log('HTTP server running at: http://localhost:8080/');

const port = 8080;
Deno.serve({ port }, handler);    
`.substring(1);

export const SAMPLE = { code } as const;
