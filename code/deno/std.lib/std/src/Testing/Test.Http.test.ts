import { describe, expect, it } from '../common/mod.ts';
import { Testing } from './mod.ts';

describe('Testing.Http', () => {
  describe('Testing.Http.Server', () => {
    it('create: listen → dispose (close)', async () => {
      const server = Testing.Http.server();
      expect(server.disposed).to.eql(false);

      expect(server.addr.port).to.be.a('number');
      expect(server.addr.port).to.not.eql(0);
      expect(server.url.base).to.eql(`http://0.0.0.0:${server.addr.port}/`);

      await server.dispose();
      expect(server.disposed).to.eql(true);
    });

    it('fetch: default handler', async () => {
      const server = Testing.Http.server(() => new Response('Hello 👋'));
      const url = server.url.join('foo');
      const res = await fetch(url);
      expect(await res.text()).to.eql('Hello 👋');
      await server.dispose();
    });
  });
});
