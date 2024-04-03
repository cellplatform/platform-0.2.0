import { Http } from '.';
import { Path, TestServer, describe, expect, it } from '../test';

describe('Http', () => {
  describe('Http.fetcher', () => {
    it('GET (defaults): OK', async () => {
      const data = { foo: 123 };
      const server = TestServer.listen(data);
      const fetch = Http.fetcher();

      const url = server.url;
      const res = await fetch('GET', url);
      server.close();

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);

      expect(res.method).to.eql('GET');
      expect(res.url).to.eql(url);
      expect(res.contentType).to.eql('application/json');
      if (res.contentType === 'application/json') {
        expect(res.data).to.eql(data);
      }
    });

    /**
     * TODO 🐷
     * - get headers
     * - rename contentType → type
     * - methods init from HttpOptions
     */

    it('GET: response headers', async () => {
      const server = TestServer.listen({}, { headers: { foo: 'abc' } });
      const fetch = Http.fetcher();
      const res = await fetch('GET', server.url);
      server.close();
      expect(Http.Headers.value(res.headers, 'foo')).to.eql('abc');
    });

    it('POST: binary', async () => {
      const data = new Uint8Array([1, 2, 3, 4]);
      const server = TestServer.listen(data);
      const fetch = Http.fetcher();

      const res = await fetch('POST', server.url);
      server.close();

      expect(res.method).to.eql('POST');
      expect(res.url).to.eql(server.url);
      expect(res.contentType).to.eql('application/octet-stream');
      if (res.contentType === 'application/octet-stream') {
        expect(res.data.type).to.eql(res.contentType);
        expect(res.data.size).to.eql(data.length);
        expect(await Http.toUint8Array(res.data)).to.eql(data);
      }
    });
  });

  describe('Http.methods', () => {
    it('get', async () => {
      const data = { foo: 123 };
      const server = TestServer.listen(data);

      const fetch = Http.fetcher();
      const raw = Http.methods(fetch);
      const origin = Http.origin(fetch, server.url);

      const res1 = await raw.get(server.url);
      const res2 = await origin.get('foo/bar');
      expect(res1.data).to.eql(data);
      expect(res2.data).to.eql(data);
      expect(res2.url).to.eql(Path.join(server.url, 'foo/bar'));

      server.close();
    });
  });
});
