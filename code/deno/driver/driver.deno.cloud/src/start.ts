import { DenoCloud } from './u.Server/mod.ts';

/**
 * Start
 */
const app = DenoCloud.server();
Deno.serve({ port: 8080 }, app.fetch);
