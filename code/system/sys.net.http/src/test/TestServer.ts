import { createServer } from 'node:http';
import { DEFAULTS, randomPort, type t } from './common';

export const TestServer = {
  /**
   * Create a transient HTTP server that responses with the given data.
   */
  listen(
    data?: t.Json | Uint8Array,
    options: { port?: number; status?: number; contentType?: string; headers?: t.HttpHeaders } = {},
  ) {
    const { status = 200 } = options;
    const port = options.port ?? randomPort();

    const isBinary = data instanceof Uint8Array;
    const mime = DEFAULTS.mime;
    const contentType = options.contentType ?? (isBinary ? mime.binary : mime.json);
    const payload = isBinary ? Buffer.from(data) : JSON.stringify(data);

    const server = createServer((req, res) => {
      res.writeHead(status, { 'Content-Type': contentType, ...options.headers });
      res.write(payload);
      res.end();
    }).listen(port);

    const url = `http://localhost:${port}/`;
    const close = () => server.close();
    return { port, url, close } as const;
  },
} as const;
