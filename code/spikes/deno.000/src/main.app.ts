// deno-lint-ignore-file no-explicit-any
import { Server } from './common.ts';

export const app = new Server.Hono();

const cors = Server.cors({
  origin: '*', // Allowed origin or use '*' to allow all origins.
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400, // Preflight cache age in seconds.
});

app.use('*', cors);
app.use('/static/*', Server.serveStatic({ root: './' }) as any); // Hack (any).
