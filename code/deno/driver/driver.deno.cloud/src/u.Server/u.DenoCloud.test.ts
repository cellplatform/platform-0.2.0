import { Http, Pkg, describe, expect, it } from './common/mod.ts';
import { DenoCloud } from './mod.ts';

describe('DenoCloud', () => {
  it('server: start → req/res → dispose', async () => {
    const app = DenoCloud.server();
    const listener = Deno.serve({ port: 0 }, app.fetch);

    const url = Http.url(listener.addr);
    const client = Http.client();

    const res = await client.get(url.base);
    expect(res.status).to.eql(200);

    const body = await res.json();
    expect(body.module.name).to.eql(Pkg.name);
    expect(body.module.version).to.eql(Pkg.version);

    await listener.shutdown();
  });
});
