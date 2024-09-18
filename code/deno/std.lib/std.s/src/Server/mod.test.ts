import { describe, expect, Http, it } from '../common.ts';
import { Server } from './mod.ts';

describe('Server', () => {
  it('app: start → req/res → dispose', async () => {
    const app = Server.create();
    const listener = Deno.serve({ port: 0 }, app.fetch);

    app.get('/', (c) => c.json({ count: 123 }));

    const client = Http.client();
    const url = Http.url(listener.addr);
    const res1 = await client.get(url.base);
    const res2 = await client.get(url.join('404'));

    expect(res1.status).to.eql(200);
    expect(res2.status).to.eql(404);

    expect(await res1.json()).to.eql({ count: 123 });
    await res2.body?.cancel();

    await listener.shutdown();
  });
});
