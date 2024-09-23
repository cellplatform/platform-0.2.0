import { Server, DenoCloud, Pkg } from '@sys/driver-deno-cloud/server';

const env = await DenoCloud.env();
const app = DenoCloud.server({ env });
const config = Server.options(8080, Pkg);

Deno.serve(config, app.fetch);
