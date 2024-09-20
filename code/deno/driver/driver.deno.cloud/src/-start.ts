import { DenoCloud, Pkg, Server } from './u.Server/mod.ts';

/**
 * Start
 */
const env = await DenoCloud.env();
const app = DenoCloud.server({ env });
Deno.serve(Server.options(8080, Pkg), app.fetch);
