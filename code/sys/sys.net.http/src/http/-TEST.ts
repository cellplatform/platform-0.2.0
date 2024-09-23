import { Http } from '.';
import { Test, expect, slug } from '../test.ui';

const port = 8080;
const Mime = Http.Headers.Mime;

/**
 * NOTE: Ensure the deno test-server is running.
 * See:  /src.deno/ (NB: archived)
 */
export default Test.describe('Http', (e) => {
  e.describe('methods', (e) => {
    const http = Http.origin({}, port);

    e.it('GET: json', async (e) => {
      const res = await http.get('/');
      expect(res.method).to.eql('GET');
      expect(res.status).to.eql(200);
      expect(res.type).to.eql(Mime.json);
      expect(res.header('content-type')).to.eql('application/json; charset=UTF-8');
      if (res.type === Mime.json) {
        type T = { msg: string };
        const msg = 'Hello World!';
        expect(res.data).to.eql({ msg });
        expect(res.json<T>().msg).to.eql(msg);
      }
    });

    e.it('GET: binary', async (e) => {
      const payload = new Uint8Array([1, 2, 3]);
      const res = await http.get('/binary');
      expect(res.method).to.eql('GET');
      expect(res.status).to.eql(200);
      expect(res.type).to.eql(Mime.binary);
      if (res.type === Mime.binary) {
        expect(res.data.size).to.eql(payload.byteLength);
        expect(await res.binary()).to.eql(payload);
      }
    });

    e.it('POST: json', async (e) => {
      const payload = { foo: slug() };
      const res = await http.post('/echo', payload);
      expect(res.method).to.eql('POST');
      expect(res.status).to.eql(200);
      expect(res.type).to.eql(Mime.json);
      expect(res.data).to.eql(payload);
    });

    e.it('POST: text', async (e) => {
      const payload = `text-${slug()}`;
      const res = await http.post('/echo', payload);
      expect(res.method).to.eql('POST');
      expect(res.status).to.eql(200);
      expect(res.type).to.eql(Mime.text);
      expect(res.data).to.eql(payload);
    });

    e.it('POST: binary', async (e) => {
      const payload = new Uint8Array([1, 2, 3]);
      const res = await http.post('/echo', payload);

      expect(res.method).to.eql('POST');
      expect(res.status).to.eql(200);
      expect(res.type).to.eql(Mime.binary);
      if (res.type === Mime.binary) {
        const binary = await res.binary();
        expect(res.data.size).to.eql(binary.byteLength);
        expect(binary).to.eql(payload);
      }
    });
  });
});
