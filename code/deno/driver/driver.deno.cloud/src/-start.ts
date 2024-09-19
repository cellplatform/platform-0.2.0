import { DenoCloud, Pkg, Server } from './u.Server/mod.ts';
import { env } from './-start.env';

/**
 * Start
 */
const app = DenoCloud.server({ env });
Deno.serve(Server.options(8080, Pkg), app.fetch);
