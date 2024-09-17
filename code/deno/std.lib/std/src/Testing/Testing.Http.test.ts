import { describe, expect, it } from '../common/mod.ts';
import { Testing } from './mod.ts';

describe('Testing.Http', () => {
  it('create: listen → dispose (close)', async () => {
    const server = Testing.http();
    expect(server.disposed).to.eql(false);

    expect(server.addr.port).to.be.a('number');
    expect(server.addr.port).to.not.eql(0);
    expect(server.url.base).to.eql(`http://0.0.0.0:${server.addr.port}/`);

    await server.dispose();
    expect(server.disposed).to.eql(true);
  });

  it('fetch: default handler', async () => {
    const server = Testing.http(() => new Response('Hello 👋'));
    const url = server.url.join('foo');
    const res = await fetch(url);
    expect(await res.text()).to.eql('Hello 👋');
    await server.dispose();
  });

  it('fetch: get', async () => {
    const server = Testing.http(() => new Response('default')).get(() => new Response('my-get'));
    const res = await fetch(server.url.base);
    expect(await res.text()).to.eql('my-get');
    await server.dispose();
  });

  it('fetch: put', async () => {
    const server = Testing.http(() => new Response('default')).put(() => new Response('my-put'));
    const res = await fetch(server.url.base, { method: 'PUT' });
    expect(await res.text()).to.eql('my-put');
    await server.dispose();
  });

  it('fetch: post', async () => {
    const server = Testing.http(() => new Response('default')).post(() => new Response('my-post'));
    const res = await fetch(server.url.base, { method: 'POST' });
    expect(await res.text()).to.eql('my-post');
    await server.dispose();
  });

  it('fetch: delete', async () => {
    const server = Testing.http(() => new Response('default')).delete(() => new Response('my-del'));
    const res = await fetch(server.url.base, { method: 'DELETE' });
    expect(await res.text()).to.eql('my-del');
    await server.dispose();
  });
});
