import { Pkg, describe, expect, it } from './common/mod.ts';
import { DenoCloud } from './mod.ts';
import { testSetup } from '../u.Server/u.DenoCloud.test.ts';

describe('DenoCloud (client)', () => {
  it('has url', () => {
    const client = DenoCloud.client('https://foo.com');
    expect(client.url.toString()).to.eql('https://foo.com/');
  });

  it('client: root', async () => {
    const { client, dispose } = testSetup();
    const res = await client.root();
    expect(res.ok).to.eql(true);
    expect(res.error).to.eql(undefined);
    if (res.ok) {
      const { name, version } = Pkg;
      expect(res.data.module).to.eql({ name, version });
    }
    await dispose();
  });
});
