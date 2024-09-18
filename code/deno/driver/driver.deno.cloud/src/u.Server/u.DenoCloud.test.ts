import { Http, Pkg, describe, expect, it } from './common/mod.ts';
import { DenoCloud } from './mod.ts';

describe('DenoCloud (Server)', () => {
  function setup() {
    const app = DenoCloud.server();
    const listener = Deno.serve({ port: 0 }, app.fetch);

    const dispose = () => listener.shutdown();
    const url = Http.url(listener.addr);
    const client = DenoCloud.client(url.base);

    return { app, client, url, dispose } as const;
  }

  it('server: start → req/res → dispose', async () => {
    const { url, dispose } = setup();
    const client = Http.client();

    const res = await client.get(url.base);
    expect(res.status).to.eql(200);

    const body = await res.json();
    expect(body.module.name).to.eql(Pkg.name);
    expect(body.module.version).to.eql(Pkg.version);

    await dispose();
  });

  it('client: root', async () => {
    const { client, dispose } = setup();
    const res = await client.root();
    expect(res.ok).to.eql(true);
    expect(res.error).to.eql(undefined);
    if (res.ok) expect(res.data).to.eql({ module: { name: Pkg.name, version: Pkg.version } });
    await dispose();
  });
});
