const targetDomain = 'https://jsr.io/@tdb/foo@0.0.14';

/**
 * Reverse proxy.
 */
export async function handler(req: Request): Promise<Response> {
  // Get the URL path from the request
  const url = new URL(req.url);
  const path = url.pathname;

  // Construct the new URL to forward the request
  const targetUrl = `${targetDomain}${path}`;

  // Fetch the response from the target server
  const targetResponse = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  // Create a new response with the fetched data
  const proxyResponse = new Response(targetResponse.body, {
    status: targetResponse.status,
    statusText: targetResponse.statusText,
    headers: targetResponse.headers,
  });

  return proxyResponse;
}
