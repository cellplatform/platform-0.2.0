import { createWriteStream } from 'node:fs';
import { createServer } from 'node:http';
import { Readable } from 'node:stream';

import { Time, Util, type t } from '../common';
import { NodeFs, beforeEach, describe, expect, it, randomPort } from '../test';
import { Http, http } from './index';

describe('Http', () => {
  describe('default instance (singleton)', () => {
    it('has methods', () => {
      expect(http.head).to.be.an.instanceof(Function);
      expect(http.get).to.be.an.instanceof(Function);
      expect(http.put).to.be.an.instanceof(Function);
      expect(http.post).to.be.an.instanceof(Function);
      expect(http.patch).to.be.an.instanceof(Function);
      expect(http.delete).to.be.an.instanceof(Function);
    });

    it('has empty headers (by default)', () => {
      expect(http.headers).to.eql({});
    });
  });

  describe('create', () => {
    it('creates (default headers)', () => {
      const client = http.create();
      expect(client.headers).to.eql({});
    });

    it('creates with custom headers (passed through all calls)', () => {
      const client = Http.create({ headers: { MyHeader: 'abc' } });
      expect(client.headers.MyHeader).to.eql('abc');
    });

    it('clones headers when creating child', () => {
      const client1 = Http.create({ headers: { foo: 'foo' } });
      const client2 = client1.create({ headers: { bar: 'bar' } });
      const client3 = client2.create({ headers: { foo: 'zoo', baz: 'baz' } });

      expect(client1.headers).to.eql({ foo: 'foo' });
      expect(client2.headers).to.eql({ foo: 'foo', bar: 'bar' });
      expect(client3.headers).to.eql({ foo: 'zoo', bar: 'bar', baz: 'baz' });
    });
  });

  describe('headers', () => {
    it('headers immutable', () => {
      const client = http.create({ headers: { foo: 'hello' } });
      const res1 = client.headers;
      const res2 = client.headers;

      expect(res1).to.eql(res2);
      expect(res1).to.not.equal(res2);
    });

    it('merges headers (client => method)', async () => {
      const client = Http.create({ headers: { foo: 'one' } });
      client.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.

      const res = await client.get('http://localhost/foo', { headers: { bar: 'two' } });
      const headers = res.headers;

      expect(headers.foo).to.eql('one');
      expect(headers.bar).to.eql('two');
    });

    it('overrides headers (client => method)', async () => {
      const client = http.create({ headers: { foo: 'one', bar: 'abc' } });
      client.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.

      const res = await client.get('http://localhost/foo', {
        headers: { foo: 'two', new: 'hello' },
      });
      const headers = res.headers;
      expect(headers.foo).to.eql('two');
      expect(headers.bar).to.eql('abc');
      expect(headers.new).to.eql('hello');
    });
  });

  describe('events (observable)', () => {
    it('BEFORE event', async () => {
      const client = http.create();
      const events: t.HttpMethodReq[] = [];

      client.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.
      client.req$.subscribe((e) => events.push(e));

      await client.get('http://localhost/foo');

      expect(events.length).to.eql(1);
      expect(events[0].method).to.eql('GET');
      expect(events[0].url).to.eql('http://localhost/foo');
    });

    it('AFTER event: respond sync (object/json)', async () => {
      const client = http.create();
      const events: t.HttpMethodRes[] = [];

      client.req$.subscribe((e) => {
        // Fake response.
        e.respond({
          status: 202,
          statusText: 'foobar',
          data: { msg: 'hello' },
        });
      });
      client.res$.subscribe((e) => events.push(e));

      const res1 = await client.get('http://localhost/foo');

      expect(events.length).to.eql(1);

      expect(events[0].method).to.eql('GET');
      expect(events[0].url).to.eql('http://localhost/foo');

      const res2 = events[0].response;
      expect(res2.status).to.eql(202);
      expect(res2.statusText).to.eql('foobar');

      expect(res1.text).to.eql(res2.text);
      expect(res1.json).to.eql({ msg: 'hello' });
    });

    it('AFTER event: respond async function (object/json)', async () => {
      const client = http.create();
      const events: t.HttpMethodRes[] = [];

      client.req$.subscribe((e) => {
        // Fake response.
        e.respond(async () => {
          await Time.wait(20);
          return {
            status: 202,
            statusText: 'foobar',
            data: { msg: 'hello' },
          };
        });
      });
      client.res$.subscribe((e) => events.push(e));

      const res1 = await client.get('http://localhost/foo');

      expect(events.length).to.eql(1);
      expect(events[0].method).to.eql('GET');
      expect(events[0].url).to.eql('http://localhost/foo');
      expect(events[0].ok).to.eql(true);
      expect(events[0].status).to.eql(202);

      const res2 = events[0].response;
      expect(res2.status).to.eql(202);
      expect(res2.statusText).to.eql('foobar');

      expect(res1.text).to.eql(res2.text);
      expect(res1.json).to.eql({ msg: 'hello' });
    });

    it('AFTER event: respond sync function (file/binary)', async () => {
      const client = http.create();
      const events: t.HttpMethodRes[] = [];

      const image1 = await NodeFs.readFile(NodeFs.resolve('assets/test/kitten.jpg'));
      const image2 = await NodeFs.readFile(NodeFs.resolve('assets/test/bird.png'));

      client.req$.subscribe((e) => {
        // Create a return stream.
        // Source: https://stackoverflow.com/a/44091532
        const data = new Readable();
        data.push(image2);
        data.push(null);

        // Switch out the return data with a different file (stream).
        e.respond(() => ({
          status: 202,
          statusText: 'foobar',
          data: data as any,
        }));
      });
      client.res$.subscribe((e) => events.push(e));

      const res = await client.post('http://localhost/foo', image1);

      expect(events.length).to.eql(1);
      expect(events[0].method).to.eql('POST');
      expect(events[0].url).to.eql('http://localhost/foo');
      expect(res.body).to.not.eql(undefined);

      if (res.body) {
        const path = NodeFs.resolve('tmp/response-bird.png');
        await NodeFs.stream.save(path, res.body);
        expect((await NodeFs.readFile(path)).toString()).to.eql(image2.toString());
      }
    });

    it('AFTER event: respond (string)', async () => {
      const client = http.create();
      const events: t.HttpMethodRes[] = [];

      client.req$.subscribe((e) => {
        // Fake response.
        e.respond({
          status: 200,
          headers: { 'content-type': 'text/plain' },
          data: 'hello', // NB: string (not object).
        });
      });
      client.res$.subscribe((e) => events.push(e));

      const res1 = await client.get('http://localhost/foo');

      expect(events.length).to.eql(1);
      expect(events[0].method).to.eql('GET');
      expect(events[0].url).to.eql('http://localhost/foo');

      const res2 = events[0].response;
      expect(res2.status).to.eql(200);
      expect(res2.statusText).to.eql('OK');

      expect(res1.text).to.eql(res2.text);
      expect(res1.text).to.eql('hello');
      expect(res1.json).to.eql('');
    });

    it('AFTER event: respond (<empty>)', async () => {
      const client = http.create();
      const events: t.HttpMethodRes[] = [];

      client.req$.subscribe((e) => {
        // Fake response.
        e.respond({
          status: 200,
          data: undefined,
        });
      });
      client.res$.subscribe((e) => events.push(e));

      const res1 = await client.get('http://localhost/foo');

      expect(events.length).to.eql(1);
      expect(events[0].method).to.eql('GET');
      expect(events[0].url).to.eql('http://localhost/foo');

      const res2 = events[0].response;
      expect(res2.status).to.eql(200);
      expect(res2.statusText).to.eql('OK');

      expect(res1.text).to.eql(res2.text);
      expect(res1.text).to.eql('');
      expect(res1.json).to.eql('');
    });

    it('sends event identifier ("uid") that is shared between before/after events', async () => {
      const client = http.create();
      client.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.

      const events: t.HttpEvent[] = [];
      client.$.subscribe((e) => events.push(e));

      await client.get('http://localhost/foo');

      expect(events.length).to.eql(2);
      expect(events[0].payload.tx).to.eql(events[1].payload.tx);
    });

    it('does not share events between instances', async () => {
      const client1 = http.create();
      const client2 = client1.create();

      client1.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.
      client2.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.

      const events1: t.HttpEvent[] = [];
      const events2: t.HttpEvent[] = [];

      client1.$.subscribe((e) => events1.push(e));
      client2.$.subscribe((e) => events2.push(e));

      await client1.get('http://localhost/foo');
      await client2.get('http://localhost/foo');
      await client2.get('http://localhost/foo');

      expect(events1.length).to.eql(2);
      expect(events2.length).to.eql(4);
    });
  });

  describe('verbs', () => {
    let events: t.HttpEvent[] = [];
    let client: t.Http;

    beforeEach(() => {
      events = [];
      client = http.create();

      client.$.subscribe((e) => events.push(e));
      client.req$.subscribe((e) => e.respond({ status: 200 })); // Fake.
    });

    it('head', async () => {
      await client.head('http://localhost/foo');
      expect(events.length).to.eql(2);
      expect(events[0].payload.method).to.eql('HEAD');
      expect(events[1].payload.method).to.eql('HEAD');
    });

    it('get', async () => {
      await client.get('http://localhost/foo');
      expect(events.length).to.eql(2);
      expect(events[0].payload.method).to.eql('GET');
      expect(events[1].payload.method).to.eql('GET');
    });

    it('put', async () => {
      await client.put('http://localhost/foo', { foo: 123 });
      expect(events.length).to.eql(2);
      expect(events[0].payload.method).to.eql('PUT');
      expect(events[1].payload.method).to.eql('PUT');
    });

    it('post', async () => {
      await client.post('http://localhost/foo', { foo: 123 });
      expect(events.length).to.eql(2);
      expect(events[0].payload.method).to.eql('POST');
      expect(events[1].payload.method).to.eql('POST');
    });

    it('patch', async () => {
      await client.patch('http://localhost/foo', { foo: 123 });
      expect(events.length).to.eql(2);
      expect(events[0].payload.method).to.eql('PATCH');
      expect(events[1].payload.method).to.eql('PATCH');
    });

    it('delete', async () => {
      await client.delete('http://localhost/foo');
      expect(events.length).to.eql(2);
      expect(events[0].payload.method).to.eql('DELETE');
      expect(events[1].payload.method).to.eql('DELETE');
    });
  });

  describe('fetch', () => {
    it('http server: text', async () => {
      const data = `console.log('hello');`;
      const port = randomPort();
      const server = createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(data);
        res.end();
      }).listen(port);

      const res = await http.create().get(`http://localhost:${port}`);
      server.close();

      expect(res.status).to.eql(200);
      expect(res.statusText).to.eql('OK');

      expect(res.headers['content-type']).to.eql('text/javascript');
      expect(res.contentType.is.binary).to.eql(false);
      expect(res.contentType.is.json).to.eql(false);
      expect(res.contentType.is.text).to.eql(true);

      expect(res.text).to.eql(data);
      expect(res.json).to.eql('');
      expect(Util.isStream(res.body)).to.eql(true);
    });

    it('http server: json', async () => {
      const data = { msg: 'hello' };
      const port = randomPort();
      const server = createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
      }).listen(port);

      const res = await http.create().get(`http://localhost:${port}`);
      server.close();

      expect(res.status).to.eql(200);
      expect(res.statusText).to.eql('OK');

      expect(res.headers['content-type']).to.eql('application/json');
      expect(res.contentType.is.binary).to.eql(false);
      expect(res.contentType.is.json).to.eql(true);
      expect(res.contentType.is.text).to.eql(false);

      expect(res.text).to.eql('');
      expect(res.json).to.eql(data);
      expect(Util.isStream(res.body)).to.eql(true);
    });

    it('http server: json (404)', async () => {
      const data = { error: 'Fail' };
      const port = randomPort();
      const server = createServer((req, res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
      }).listen(port);

      const res = await http.create().get(`http://localhost:${port}`);
      server.close();

      expect(res.status).to.eql(404);
      expect(res.statusText).to.eql('Not Found'); // NB: Generated by node HTTP server.
    });

    it.only('http server: file/binary', async () => {
      const path = NodeFs.resolve('assets/test/kitten.jpg');
      const image = await NodeFs.readFile(path);

      const port = randomPort();
      const server = createServer((req, res) => {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': image.byteLength,
        });
        console.log('image.byteLength', image.byteLength);
        NodeFs.createReadStream(path).pipe(res);
      }).listen(port);

      const res = await http.create().get(`http://localhost:${port}`);
      server.close();

      expect(res.status).to.eql(200);
      expect(res.statusText).to.eql('OK');

      expect(res.headers['content-type']).to.eql('image/jpeg');
      expect(res.contentType.is.binary).to.eql(true);
      expect(res.contentType.is.json).to.eql(false);
      expect(res.contentType.is.text).to.eql(false);

      expect(res.text).to.eql('');
      expect(res.json).to.eql('');

      console.log('res.contentType', res.contentType.toString());

      expect(Util.isStream(res.body)).to.eql(true);

      if (res.body) {
        const path = NodeFs.resolve('tmp/kitten.jpg');

        console.log('path', path);
        console.log('res.body', res.body);

        await NodeFs.stream.save(path, res.body);

        // await saveReadableStreamToFile(path, res.body);

        // expect((await NodeFs.readFile(path)).toString()).to.eql(image.toString());
      }
    });

    it('injected [fetch] function', async () => {
      const requests: t.HttpRequestPayload[] = [];
      const data = { msg: 'hello' };
      const fetch: t.HttpFetch = async (req) => {
        requests.push(req);
        await Time.wait(10);
        return {
          status: 202,
          headers: Util.toRawHeaders({ foo: 'bar', 'Content-Type': 'application/json' }),
          body: null,
          text: async () => JSON.stringify(data),
          json: async () => data,
        };
      };

      const client = http.create({ fetch });
      const res = await client.post(
        `http://localhost`,
        { send: true },
        { headers: { foo: '123' } },
      );

      expect(res.status).to.eql(202);
      expect(res.statusText).to.eql('OK');
      expect(res.headers.foo).to.eql('bar');
      expect(res.headers['content-type']).to.eql('application/json');

      expect(res.contentType.is.binary).to.eql(false);
      expect(res.contentType.is.json).to.eql(true);
      expect(res.contentType.is.text).to.eql(false);

      expect(res.json).to.eql(data);
      expect(res.json).to.eql(data); // NB: Multiple calls to method does not fail.
      expect(res.text).to.eql('');
      expect(res.body).to.eql(undefined);

      expect(requests.length).to.eql(1);
      expect(requests[0].url).to.eql('http://localhost');
      expect(requests[0].mode).to.eql('cors');
      expect(requests[0].method).to.eql('POST');
      expect(requests[0].data).to.eql({ send: true });
    });

    it('modified JSON content-type', async () => {
      const requests: t.HttpRequestPayload[] = [];
      const data = { msg: 'hello' };

      const fetch: t.HttpFetch = async (req) => {
        requests.push(req);
        await Time.wait(10);
        return {
          status: 202,
          headers: Util.toRawHeaders({ 'Content-Type': 'application/vnd.foo.picture+json' }),
          body: null,
          text: async () => JSON.stringify(data),
          json: async () => data,
        };
      };

      const client = http.create({ fetch });
      const res = await client.post(`http://localhost`, { send: true });

      expect(res.contentType.is.json).to.eql(true); // NB: understands weird vendor variant of the JSON content-type.
    });
  });

  describe('modify (HTTP server)', () => {
    const testServer = () => {
      const port = randomPort();
      const instance = createServer((req, res) => {
        api.headers = req.headers as t.HttpHeaders;
        res.writeHead(200).end();
      }).listen(port);
      const api = {
        port,
        instance,
        headers: {} as unknown as t.HttpHeaders,
        dispose: () => instance.close(),
      };
      return api;
    };

    it('header(key, value)', async () => {
      const server = testServer();
      const client = http.create({ headers: { foo: 'one' } });

      const events: t.HttpMethodReq[] = [];
      client.req$.subscribe((e) => {
        events.push(e);
        e.modify.header('foo', 'abc');
        e.modify.header('bar', 'hello');
        e.modify.header('baz', 'hello');
      });
      client.req$.subscribe((e) => {
        e.modify.header('foo', 'zoo');
        e.modify.header('bar', ''); // NB: <empty> === delete
      });

      await client.get(`http://localhost:${server.port}`);
      server.dispose();

      expect(events[0].isModified).to.eql(true);

      const headers = server.headers;
      expect(headers.foo).to.eql('zoo');
      expect(headers.bar).to.eql(undefined);
      expect(headers.baz).to.eql('hello');
    });

    it('headers.merge (multiple times, cumulative)', async () => {
      const server = testServer();
      const client = http.create({ headers: { foo: 'one', bar: 'abc', zoo: 'zoo' } });
      const events: t.HttpMethodReq[] = [];

      client.req$.subscribe((e) => {
        events.push(e);
        e.modify.headers.merge({ foo: 'two', baz: 'baz' });
        e.modify.headers.merge({ zoo: '' }); // NB: delete
        e.modify.headers.merge({ foo: 'three' });
      });

      await client.get(`http://localhost:${server.port}/foo`);
      server.dispose();

      expect(events[0].isModified).to.eql(true);

      const headers = server.headers;
      expect(headers.zoo).to.eql(undefined);
      expect(headers.foo).to.eql('three');
      expect(headers.bar).to.eql('abc');
      expect(headers.baz).to.eql('baz');
    });

    it('headers.replace', async () => {
      const server = testServer();
      const client = http.create({ headers: { foo: 'one' } });

      const events: t.HttpMethodReq[] = [];
      client.req$.subscribe((e) => {
        events.push(e);
        e.modify.headers.replace({ foo: 'two', baz: 'baz' });
      });
      client.req$.subscribe((e) => {
        e.modify.headers.replace({ bar: 'bar', zoo: '' });
      });

      await client.get(`http://localhost:${server.port}`);
      server.dispose();

      expect(events[0].isModified).to.eql(true);

      const headers = server.headers;
      expect(headers.foo).to.eql(undefined);
      expect(headers.zoo).to.eql(undefined);
      expect(headers.bar).to.eql('bar');
    });
  });
});
