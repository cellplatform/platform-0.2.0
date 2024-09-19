import { Pkg, Server } from './mod.ts';

/**
 * HTTP Web-Server
 */
const app = Server.create();
Deno.serve(Server.options(8000, Pkg), app.fetch);

/**
 * Routes
 */
app.get('/', (c) => c.json({ msg: '👋' }));
