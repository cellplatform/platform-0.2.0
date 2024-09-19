import { DenoCloud, Pkg, Server } from './u.Server/mod.ts';

/**
 * Start
 * Ensure you have a .env file with:
 *   - PRIVY_APP_ID
 *   - PRIVY_APP_SECRET
 */
const app = DenoCloud.server();
Deno.serve(Server.options(8080, Pkg), app.fetch);
