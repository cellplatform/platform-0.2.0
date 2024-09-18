import { DenoCloud } from './Server/mod';

/**
 * Start
 */
const app = DenoCloud.server();
Deno.serve({ port: 8080 }, app.fetch);
