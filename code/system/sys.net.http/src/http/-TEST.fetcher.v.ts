import type { IncomingMessage } from 'node:http';
import { Http } from '.';
import { TestServer, describe, expect, it } from '../test';

describe('Http.fetcher', () => {
  it('GET (defaults): OK', async () => {
    type T = { foo: number };
    const data: T = { foo: 123 };
    const server = TestServer.listen(data);
    const fetch = Http.fetcher();

    const url = server.url;
    const res = await fetch('GET', url);
    server.close();

    expect(res.ok).to.eql(true);
    expect(res.status).to.eql(200);
    expect(res.elapsed).to.greaterThan(0);

    expect(res.method).to.eql('GET');
    expect(res.url).to.eql(url);
    expect(res.type).to.eql('application/json');
    if (res.type === 'application/json') {
      expect(res.data).to.eql(data);
      expect(res.toJson<T>()).to.eql(data);
    }
  });

  it('GET: response headers', async () => {
    const server = TestServer.listen({}, { headers: { foo: 'abc' } });
    const fetch = Http.fetcher();
    const res = await fetch('GET', server.url);
    server.close();
    expect(Http.Headers.value(res.headers, 'foo')).to.eql('abc');
    expect(res.header('foo')).to.eql('abc');
    expect(res.header('bar')).to.eql('');
  });

  it('GET: content-type: application/json; charset=UTF-8 (← multi-part value)', async () => {
    const contentType = 'application/json; charset=UTF-8';
    const server = TestServer.listen({ foo: 123 }, { contentType });
    const fetch = Http.fetcher();
    const res = await fetch('GET', server.url);

    expect(res.header('Content-Type')).to.eql(contentType);
    expect(res.type).to.eql('application/json');
    expect(res.data).to.eql({ foo: 123 });
  });

  it('GET: 401 (not authorized)', async () => {
    const accessToken = '0xAbc';
    const server = TestServer.listen({}, { accessToken });
    const res1 = await Http.fetcher({ accessToken })('GET', server.url);
    const res2 = await Http.fetcher()('GET', server.url, { accessToken });
    const res3 = await Http.fetcher()('GET', server.url); // NB: fail.
    server.close();

    expect(res1.status).to.eql(200);
    expect(res2.status).to.eql(200);
    expect(res3.status).to.eql(401);
  });

  it('GET: pass {headers} in fetch options', async () => {
    const requests: IncomingMessage[] = [];
    const server = TestServer.listen({}, { onRequest: (req) => requests.push(req) });
    const headers = { foo: 'hello' };
    await Http.fetcher()('GET', server.url);
    await Http.fetcher({ headers })('GET', server.url);
    await Http.fetcher()('GET', server.url, { headers });

    const h0 = Http.Headers.fromRaw(requests[0].headers);
    const h1 = Http.Headers.fromRaw(requests[1].headers);
    const h2 = Http.Headers.fromRaw(requests[2].headers);

    expect(Http.Headers.value(h0, 'foo')).to.eql('');
    expect(Http.Headers.value(h1, 'foo')).to.eql('hello');
    expect(Http.Headers.value(h2, 'foo')).to.eql('hello');
  });

  it('POST: binary', async () => {
    const data = new Uint8Array([1, 2, 3, 4]);
    const server = TestServer.listen(data);
    const fetch = Http.fetcher();
    const res = await fetch('POST', server.url);
    server.close();

    expect(res.method).to.eql('POST');
    expect(res.url).to.eql(server.url);
    expect(res.type).to.eql('application/octet-stream');
    if (res.type === 'application/octet-stream') {
      expect(res.data.type).to.eql(res.type);
      expect(res.data.size).to.eql(data.length);
      expect(await Http.toUint8Array(res.data)).to.eql(data);

      const d1 = await res.toUint8Array();
      const d2 = await res.toUint8Array();
      expect(d1).to.equal(d2); // NB: same instance (cached after first call).
      expect(d1).to.eql(data);
    }
  });
});
