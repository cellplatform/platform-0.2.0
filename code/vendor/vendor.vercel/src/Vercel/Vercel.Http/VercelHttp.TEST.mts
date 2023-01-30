import { describe, expect, it, TestUtil } from '../../test/index.mjs';
import { Util } from './common/index.mjs';
import { VercelHttp } from './index.mjs';

describe('VercelHttp', async () => {
  const fs = TestUtil.filesystem();
  const { http } = TestUtil;

  describe('Util', () => {
    describe('shasum (SHA1 digest)', () => {
      it('hash: <empty> (undefined input)', () => {
        expect(Util.shasum()).to.eql('');
      });

      it('hash: string', () => {
        const res = Util.shasum('hello');
        expect(res).to.eql('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
      });

      it('hash: Uint8Array', async () => {
        const path = 'VercelHttp/sample.dat';
        const data = { foo: 123 };

        await fs.write(path, data);
        const file = await fs.read(path);

        const res = Util.shasum(file);
        expect(res).to.eql('be56893d6faa9d742f1595f8d077af6083ba8dd6');
      });
    });

    describe('url', () => {
      it('toUrl', () => {
        expect(Util.toUrl(12, '  teams  ')).to.eql('https://api.vercel.com/v12/teams');
        expect(Util.toUrl(12, 'teams?123')).to.eql('https://api.vercel.com/v12/teams'); // NB: Strips query-string.
      });

      it('toUrl: query', () => {
        type Q = Record<string, string | number | undefined>;

        const test = (query: Q, expected: string) => {
          const res = Util.toUrl(12, 'projects', query);
          expect(res).to.eql(`${'https://api.vercel.com/v12/projects'}${expected}`);
        };

        test({}, '');
        test({ teamId: 'foo' }, '?teamId=foo');
        test({ teamId: 'foo', foo: 123 }, '?teamId=foo&foo=123');

        test({ teamId: undefined }, '');
        test({ teamId: undefined, foo: 123 }, '?foo=123');
      });
    });

    describe('ctx (context)', () => {
      it('toCtx', () => {
        const token = 'abc123';
        const res1 = Util.toCtx(fs, http, token);
        const res2 = Util.toCtx(fs, http, token, 1234);

        expect(res1.token).to.eql(token);
        expect(res1.Authorization).to.eql(`Bearer ${token}`);
        expect(res1.headers.Authorization).to.eql(res1.Authorization);
      });

      it('toCtx: ctx.url', () => {
        const token = 'abc123';
        const res1 = Util.toCtx(fs, http, token);
        const res2 = Util.toCtx(fs, http, token, 1234);

        expect(res1.url(1, 'foo')).to.match(new RegExp(`\/v1\/foo$`));
        expect(res1.url(1, 'foo', { bar: 123 })).to.match(/\/foo\?bar=123$/);

        expect(res2.url(1234, 'foo')).to.match(/\/v1234\/foo$/);
        expect(res2.url(456, 'foo', undefined)).to.match(/\/v456\/foo$/);
      });
    });

    describe('auth', () => {
      it('not authorized', async () => {
        const token = 'abc123';
        const client = VercelHttp({ fs, token });
        const res = await client.teams.list();
        expect(res.ok).to.eql(false);
        expect(res.status).to.eql(403);
        expect(res.error?.code).to.eql('forbidden');
        expect(res.error?.message).to.include('Not authorized');
      });
    });
  });
});
