import { describe, expect, it } from '.';

describe('@farcaster/hub-web', () => {
  /**
   * https://github.com/farcasterxyz/hub-monorepo/tree/main/packages/hub-web#getting-start-fetching-casts
   */
  it.skip('Getting start: fetching casts', async () => {
    const { getHubRpcClient } = await import('@farcaster/hub-web');
    const client = getHubRpcClient('https://testnet1.farcaster.xyz:2285', {});

    let count = 0;
    const res = await client.getCastsByFid({ fid: 15 });
    res.map(({ messages }) => (count = messages.length));

    expect(res.isOk()).to.eql(true);
    expect(count).to.eql(1);
  });
});
