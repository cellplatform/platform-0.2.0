import { NetworkConnection } from '.';
import { Dev, TestEdge, type t } from '../../test.ui';

type T = {
  props: t.NetworkConnectionProps;
  debug: { count: number; debugBg?: boolean };
};
const initial: T = {
  props: {},
  debug: { count: 0 },
};

const name = NetworkConnection.displayName ?? '';
export default Dev.describe(name, async (e) => {
  const left = await TestEdge.createEdge('Left');
  const right = await TestEdge.createEdge('Right');

  type LocalStore = Pick<T['debug'], 'debugBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.webrtc');
  const local = localstore.object({ debugBg: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.debugBg = local.debugBg;
    });

    const monitorPeer = (edge: t.NetworkConnectionEdge) => {
      const peer = edge.network.peer.events();
      peer.cmd.conn$.subscribe((e) => dev.redraw('debug'));
    };
    monitorPeer(left);
    monitorPeer(right);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const debugBg = local.debugBg;
        ctx.subject.backgroundColor(!!debugBg ? 1 : 0);

        return (
          <NetworkConnection
            {...e.state.props}
            left={left}
            right={right}
            style={{ MarginY: debugBg ? 20 : 0 }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    TestEdge.dev.headerFooterConnectors(dev, left.network, right.network);
    TestEdge.dev.peersSection(dev, left.network, right.network).hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debugBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debugBg = Dev.toggle(d.debug, 'debugBg'))));
      });
      dev.hr(-1, 5);

      const sendButton = (edge: t.NetworkConnectionEdge) => {
        dev.button(`send data from "${edge.kind}"`, async (e) => {
          type T = { count?: number };
          const shared = edge.network.shared;
          shared.doc?.change((d) => {
            const data = d as T;
            data.count = data.count ? data.count + 1 : 1;
          });
        });
      };
      sendButton(left);
      sendButton(right);
    });
  });
});
