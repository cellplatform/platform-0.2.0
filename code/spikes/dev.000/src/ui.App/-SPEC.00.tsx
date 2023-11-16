import { Webrtc, UI } from 'ext.lib.peerjs';
import { Color, COLORS, Dev, Hash, type t, css } from '../test.ui';

type T = {
  selected?: string;
  accessToken?: string;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'App.00';

export default Dev.describe(name, (e) => {
  let network: t.NetworkDocSharedRef;
  let client: t.WebRtcEvents;

  const self = Webrtc.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>(async (e) => {
        const { ui } = await import('sys.net.webrtc');
        const WebRtc = await ui();
        return <WebRtc.GroupVideo client={client} selected={e.state.selected} />;
      });
  });

  e.it('ui.header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header
      .padding(0)
      .border(-0.1)
      .render(async (e) => {
        const { ui } = await import('sys.net.webrtc');
        const WebRtc = await ui();

        return (
          <WebRtc.Connect.Stateful
            onReady={async (e) => {
              console.info('⚡️ Connect.onReady:', e);
              network = e.network;
              client = e.client;
            }}
            onNetwork={(e) => {
              console.info('⚡️ Connect.onNetwork:', e);
              dev.redraw();
            }}
            onChange={async (e) => {
              console.info('⚡️ Connect.onChange:', e);
              state.change((d) => (d.selected = e.selected));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row(async (e) => {
      const { Auth } = await import('ext.lib.auth.privy');
      return (
        <Auth.Info
          data={{ provider: Auth.Env.provider }}
          fields={[
            'Auth.Login',
            'Id.User',
            'Id.User.Phone',
            'Auth.Link.Wallet',
            'Wallet.List',
            'Chain.List',
            'Chain.List.Title',
          ]}
          margin={[10, 20]}
          onChange={(e) => state.change((d) => (d.accessToken = e.accessToken))}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const count = (label: string, by: number) => {
        dev.button((btn) => {
          const current = () => (network?.current.tmp.count ?? 0) as number;
          const next = () => current() + by;
          btn
            .label(label)
            .right(() => `${current()} ${by < 0 ? '-' : '+'} ${Math.abs(by)}`)
            .onClick((e) => network?.change((d) => (d.tmp.count = next())));
        });
      };

      count('increment', 1);
      // count('decrement', -1);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
