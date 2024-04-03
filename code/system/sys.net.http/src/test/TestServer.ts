import { createServer, type IncomingMessage } from 'node:http';
import { HttpHeaders } from '../http';
import { DEFAULTS, randomPort, statusOK, type t } from './common';

export const TestServer = {
  /**
   * Create a transient HTTP server that responses with the given data.
   */
  listen(
    data?: t.Json | Uint8Array,
    options: {
      port?: number;
      status?: number;
      contentType?: string;
      headers?: t.HttpHeaders;
      accessToken?: string;
      onRequest?: (req: IncomingMessage) => void;
    } = {},
  ) {
    const MIME = DEFAULTS.mime;
    const port = options.port ?? randomPort();
    const isBinary = data instanceof Uint8Array;
    const contentType = options.contentType ?? (isBinary ? MIME.binary : MIME.json);
    const payload = isBinary ? Buffer.from(data) : JSON.stringify(data);

    const server = createServer((req, res) => {
      options.onRequest?.(req);
      let status = options.status ?? 200;
      if (options.accessToken) {
        const jwt = HttpHeaders.value(req.headers as any, 'Authorization');
        if (jwt !== `Bearer ${options.accessToken}`) status = 401; // Not Authorized.
      }

      const headers: t.HttpHeaders = {
        'Content-Type': contentType,
        ...options.headers,
      };

      res.writeHead(status, headers);
      if (statusOK(status)) res.write(payload);
      res.end();
    }).listen(port);

    const host = `localhost:${port}`;
    return {
      port,
      host,
      url: `http://${host}/`,
      close: () => server.close(),
    } as const;
  },

  requestData<T>(req: IncomingMessage) {
    return new Promise<string>((resolve, reject) => {
      let body = '';

      // Listen for data chunks
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(body);
      });
    });
  },
} as const;
