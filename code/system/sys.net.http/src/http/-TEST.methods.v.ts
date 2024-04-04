import { Http } from '.';
import { Path, TestServer, describe, expect, it } from '../test';

describe('Http.methods', () => {
  describe('init', () => {
    it('create from [fetcher] function', async () => {
      const server = TestServer.listen({ count: 123 });
      const methods = Http.methods(Http.fetcher());
      const res = await methods.get(server.url);
      server.close();
      expect(res.status).to.eql(200);
      expect(res.data).to.eql({ count: 123 });
    });

    it('create from {options}', async () => {
      const accessToken = '0xAbc';
      const server = TestServer.listen({}, { accessToken });
      const res1 = await Http.methods({ accessToken }).get(server.url);
      const res2 = await Http.methods().get(server.url);
      server.close();
      expect(res1.status).to.eql(200);
      expect(res2.status).to.eql(401);
    });

    it('create with "origin" domain', async () => {
      const urls: string[] = [];
      const server = TestServer.listen(
        { count: 123 },
        { onRequest: (req) => urls.push(req.url || '') },
      );
      const origin = Http.origin({}, server.url);
      const res = await origin.get('foo/bar');
      server.close();

      expect(urls[0]).to.eql('/foo/bar');
      expect(res.data).to.eql({ count: 123 });
      expect(res.url).to.eql(`${server.url}foo/bar`);
    });
  });

  describe('verbs', () => {
    it('GET', async () => {
      const data = { foo: 123 };
      const server = TestServer.listen(data);
      const fetch = Http.fetcher();
      const raw = Http.methods(fetch);
      const origin = Http.origin(fetch, server.url);

      const res1 = await raw.get(server.url);
      const res2 = await origin.get('foo/bar', { msg: 'hello' });
      server.close();

      expect(res1.method).to.eql('GET');
      expect(res1.data).to.eql(data);
      expect(res2.data).to.eql(data);
      expect(res2.url).to.eql(Path.join(server.url, 'foo/bar?msg=hello'));
    });

    it('PUT', async () => {
      let json = '';
      const payload = { foo: 123 };
      const server = TestServer.listen(
        {},
        { onRequest: async (req) => (json = await TestServer.data(req).string()) },
      );
      const origin = Http.origin({}, server.url);
      const res = await origin.put('foo/bar', payload, { msg: 'hello' });
      server.close();
      expect(res.status).to.eql(200);
      expect(res.method).to.eql('PUT');
      expect(res.url).to.eql(Path.join(server.url, '/foo/bar?msg=hello'));
      expect(JSON.parse(json)).to.eql(payload);
    });

    it('POST: json', async () => {
      let json = '';
      const payload = { foo: 123 };
      const server = TestServer.listen(
        {},
        { onRequest: async (req) => (json = await TestServer.data(req).string()) },
      );
      const origin = Http.origin({}, server.url);
      const res = await origin.post('foo/bar', payload, { msg: 'hello' });
      server.close();
      expect(res.status).to.eql(200);
      expect(res.method).to.eql('POST');
      expect(res.url).to.eql(Path.join(server.url, '/foo/bar?msg=hello'));
      expect(JSON.parse(json)).to.eql(payload);
    });

    it('POST: binary', async () => {
      let binary: Uint8Array | undefined;
      const payload = new Uint8Array([1, 2, 3]);
      const server = TestServer.listen(
        {},
        { onRequest: async (req) => (binary = await TestServer.data(req).uint8Array()) },
      );
      const origin = Http.origin({}, server.url);
      const res = await origin.post('foo/bar', payload);
      server.close();
      expect(res.status).to.eql(200);
      expect(binary).to.eql(payload);
    });

    it('PATCH', async () => {
      let json = '';
      const payload = { foo: 123 };
      const server = TestServer.listen(
        {},
        { onRequest: async (req) => (json = await TestServer.data(req).string()) },
      );
      const origin = Http.origin({}, server.url);
      const res = await origin.patch('foo/bar', payload, { msg: 'hello' });
      server.close();
      expect(res.status).to.eql(200);
      expect(res.method).to.eql('PATCH');
      expect(res.url).to.eql(Path.join(server.url, '/foo/bar?msg=hello'));
      expect(JSON.parse(json)).to.eql(payload);
    });

    it('DELETE', async () => {
      const server = TestServer.listen({});
      const origin = Http.origin({}, server.url);
      const res = await origin.delete('foo/bar', { msg: 'hello' });
      server.close();
      expect(res.status).to.eql(200);
      expect(res.method).to.eql('DELETE');
      expect(res.url).to.eql(Path.join(server.url, '/foo/bar?msg=hello'));
    });
  });
});
