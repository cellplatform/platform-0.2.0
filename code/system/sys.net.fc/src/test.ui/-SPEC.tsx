import { Dev } from '../test.ui';

type T = {
  casts: string[];
  debug: { spinning: boolean; fid: number };
};
const initial: T = {
  casts: [],
  debug: {
    spinning: false,
    fid: 15, // 12567
  },
};

/**
 * Docs:
 *    https://github.com/farcasterxyz/hub-monorepo/tree/main/packages/hub-web
 *    https://github.com/farcasterxyz/hub-monorepo/tree/main/packages/hub-nodejs/docs
 */

export default Dev.describe('Root', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        const casts = e.state.casts;

        if (casts.length === 0) return <div>Empty</div>;

        return (
          <div>
            {casts.map((cast, i) => {
              return <div key={i}>{cast}</div>;
            })}
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.button((btn) =>
      btn
        .label('getCastsByFid')
        .right('← "hello world"')
        .spinner((e) => e.state.debug.spinning)
        .onClick(async (e) => {
          await e.change((d) => (d.debug.spinning = true));

          // import { getHubRpcClient } from '@farcaster/hub-web';
          const { getHubRpcClient } = await import('@farcaster/hub-web');

          /**
           *
           * Sample connect to hub.
           * https://github.com/farcasterxyz/hub-monorepo/tree/main/packages/hub-web#getting-start-fetching-casts
           *
           */
          const tmp: string[] = [];

          const client = getHubRpcClient('https://testnet1.farcaster.xyz:2285', {});
          const fid = e.state.current.debug.fid;
          const res = await client.getCastsByFid({ fid });

          const list = res.map((casts) =>
            casts.messages.map((cast) => {
              const text = cast.data?.castAddBody?.text;
              console.log(text);
              tmp.push(text ?? '');
              return text;
            }),
          );

          await e.change((d) => {
            d.casts = tmp;
            d.debug.spinning = false;
          });
        }),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { casts } = e.state;
      const { fid } = e.state.debug;
      const data = {
        fid,
        casts,
      };
      return <Dev.Object name={'Root'} data={data} expand={1} />;
    });
  });
});
