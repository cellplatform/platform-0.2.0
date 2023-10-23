import { Dev, ObjectView, PeerDev, css, cuid, type t } from '../../test.ui';

type T = {
  peerid: { local: string; remote: string };
  options?: t.PeerOptions;
  debug: { connectingData?: boolean };
};
const initial: T = {
  peerid: { local: '', remote: '' },
  debug: {},
};

/**
 * Spec
 * - https://peerjs.com
 * - https://github.com/peers/peerjs
 */
const name = 'Sample';

export default Dev.describe(name, (e) => {
  type LocalStore = { localPeer: string; remotePeer: string };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs');
  const local = localstore.object({
    localPeer: cuid(),
    remotePeer: '',
  });

  const connections: t.DataConnection[] = [];
  let peer: t.Peer;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.peerid.local = local.localPeer;
      d.peerid.remote = local.remotePeer;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([450, null])
      .display('grid')
      .render<T>((e) => {
        const styles = { base: css({ padding: 15, overflow: 'hidden' }) };
        const data = { peer, connections };
        return (
          <div {...styles.base}>
            <ObjectView name={'ext.lib.peerjs'} data={data} expand={1} />
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    PeerDev.peersSection({
      dev,
      state,
      local,
      onPeer: (p) => (peer = p),
    });

    dev.hr(0, 20);

    dev.section('Data', (dev) => {
      const canConnect = () => {
        const ids = state.current.peerid;
        return Boolean(ids.local && ids.remote);
      };

      dev.button((btn) => {
        btn
          .label(`connect`)
          .enabled((e) => canConnect())
          .spinner((e) => Boolean(e.state.debug.connectingData))
          .onClick(async (e) => {
            await e.change((d) => (d.debug.connectingData = true));
            const { local, remote } = e.state.current.peerid;
            const conn = peer.connect(remote);
            console.log('remote', remote);
            console.log('peer', peer);
            console.log('conn', conn);
            conn.on('open', async () => {
              console.log('open', conn);
              conn.send(`hi from ${local}!`);
              connections.push(conn);
              dev.redraw();
              await e.change((d) => (d.debug.connectingData = false));
            });
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.button('console.log( peer )', (e) => {
        console.log('peer', peer);
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { ...e.state };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
