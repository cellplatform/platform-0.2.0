import { Dev, type t } from '../../test.ui';

type T = {
  selected?: string;
  client?: t.WebRtcEvents;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'App';

export default Dev.describe(name, (e) => {
  let network: t.NetworkDocSharedRef;

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
        return <WebRtc.GroupVideo client={e.state.client} selected={e.state.selected} />;
      });
  });

  e.it('ui:debug', async (e) => {
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
            }}
            onNetwork={(e) => {
              console.info('⚡️ Connect.onNetwork:', e);
              dev.redraw();
            }}
            onChange={async (e) => {
              console.info('⚡️ Connect.onChange:', e);
              dev.redraw();

              //               if (!syncer) {
              //                 const info = await e.client.info.get();
              //                 const syncers = info?.syncers ?? [];
              //                 const total = syncers.length;
              //                 syncer = syncers[0].syncer; // ← ✋ NB: First one reported only.
              //                 console.info(`network syncer established [0 of ${total}]`, syncer);
              //                 dev.redraw();
              //               }
              //
              //               state.change((d) => {
              //                 d.props.selected = e.selected;
              //                 d.props.client = e.client;
              //               });
            }}
          />
        );
      });

    dev.row(async (e) => {
      const { Auth } = await import('ext.driver.auth.privy');
      return (
        <Auth.Info
          data={{ provider: Auth.Env.provider }}
          fields={[
            'Auth.Login',
            'Id.User.Phone',
            'Auth.Link.Wallet',
            'Wallet.List',
            'Chain.List',
            'Chain.List.Title',
          ]}
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
            .onClick((e) => {
              network?.change((d) => (d.tmp.count = next()));
            });
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
