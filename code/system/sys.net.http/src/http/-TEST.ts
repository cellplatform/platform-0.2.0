import { Test, expect, type t } from '../test.ui';
import { Http } from '.';

const port = 8080;
const Mime = Http.Headers.Mime;

/**
 * NOTE: Ensure the deno test-server is running.
 * See:  /src.deno/
 */
export default Test.describe('Http', (e) => {
  e.describe('methods', (e) => {
    e.it('get', async (e) => {
      const http = Http.origin({}, port);

      const res = await http.get('/');

      expect(res.status).to.eql(200);
      expect(res.type).to.eql(Mime.json);
      expect(res.header('content-type')).to.eql('application/json; charset=UTF-8');
    });
  });
});
