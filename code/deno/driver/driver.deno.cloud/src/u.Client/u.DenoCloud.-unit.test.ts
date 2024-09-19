import { Pkg, describe, expect, it } from './common/mod.ts';
import { DenoCloud } from './mod.ts';
import { testSetup } from '../u.Server/u.DenoCloud.-unit.test.ts';

describe('DenoCloud (client)', () => {
  it('has url', () => {
    const client = DenoCloud.client('https://foo.com');
    expect(client.url.toString()).to.eql('https://foo.com/');
  });

  describe('/', () => {
    it('GET root info', async () => {
      const { client, dispose } = testSetup();
      const res = await client.info();

      expect(res.ok).to.eql(true);
      expect(res.error).to.eql(undefined);
      if (res.ok) {
        const data = res.data;
        expect(data.module).to.eql({ name: Pkg.name, version: Pkg.version });
      }
      await dispose();
    });
  });

  describe('/subhosting', () => {
    it('GET root info', async () => {
      const { client, dispose } = testSetup();
      const res = await client.subhosting.info();

      expect(res.ok).to.eql(true);
      expect(res.error).to.eql(undefined);
      if (res.ok) {
        const data = res.data;
        expect(data.description).to.include('deno:subhosting™️');
        expect(data.module).to.eql({ name: Pkg.name, version: Pkg.version });
        expect(data.auth.identity).to.eql('');
        expect(data.auth.verified).to.eql(false);
        expect(data.organization.id).to.be.string;
        expect(data.organization.name).to.be.string;
      }
      await dispose();
    });
  });
});
