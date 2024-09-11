import { Path, Http } from './common/libs.ts';

/**
 * Web server.
 */
export async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const meta = new URL(import.meta.url);
  console.log('meta', meta);

  const dir = meta.pathname.replace('/src/mod.ts', '/dist');

  let filepath = url.pathname;
  if (filepath === '/') filepath = '/index.html'; // Serve index.html for the root path.

  const path = Path.join(dir, filepath);
  console.log('🌳', path);

  try {
    return await Http.Serve.file(req, path);
  } catch {
    return new Response('File not found', { status: 404 });
  }
}
