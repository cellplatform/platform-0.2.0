import { Server, DenoCloud, Pkg } from '@sys/driver-deno-cloud/server';

const env = await DenoCloud.env();
const app = DenoCloud.server({ env });
Deno.serve(Server.options(8080, Pkg), app.fetch);
