import { describe, expect, it, Testing } from '../common/mod.ts';
import { DEFAULTS } from './common';
import { Http } from './mod.ts';

describe('Http', () => {
  const ApplicationJson = DEFAULTS.contentType;

  describe('HttpFetchClient', () => {
    it('server SAMPLE', async () => {
      console.log('⚡️💦🐷🌳🦄 🍌🧨🌼✨🧫 🐚👋🧠⚠️ 💥👁️💡• ↑↓←→');
      const server = Testing.Http.server();
      await server.dispose();
    });

    describe('client.headers', () => {
      it('headers: (default)', () => {
        const client = Http.client();
        expect(client.headers).to.eql({ 'Content-Type': ApplicationJson });
        expect(client.header('Content-Type')).to.eql(ApplicationJson);
      });

      it('header: authToken → headers:{ Authorization } ← Bearer Token', () => {
        const client1 = Http.client({ accessToken: 'my-jwt' });
        const client2 = Http.client({ accessToken: () => 'my-dynamic' });
        expect(client1.header('Authorization')).to.eql(`Bearer ${'my-jwt'}`);
        expect(client2.header('Authorization')).to.eql('my-dynamic');
      });

      it('header: static/dynamic content-type', () => {
        const client1 = Http.client({ contentType: 'foo' });
        const client2 = Http.client({ contentType: () => 'bar' });
        expect(client1.contentType).to.eql('foo');
        expect(client2.contentType).to.eql('bar');
      });
    });
  });
});
