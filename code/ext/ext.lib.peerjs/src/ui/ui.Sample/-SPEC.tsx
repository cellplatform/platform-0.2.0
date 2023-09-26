import { Peer, type DataConnection, type PeerOptions } from 'peerjs';
import { Button, DEFAULTS, Dev, Icons, ObjectView, Path, css, cuid, type t } from '../../test.ui';

type T = {
  peerid: { local: string; remote: string };
  options?: PeerOptions;
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

/**
 * Helpers
 */
export const Wrangle = {
  toPeerOptions(args: { host: string; path: string; key: string }): PeerOptions {
    const host = Path.trimHttpPrefix(args.host);
    const path = `/${Path.trimSlashes(args.path)}`;
    const key = args.key;
    const port = 443;
    const secure = true;
    return { host, path, key, port, secure };
  },
} as const;

export default Dev.describe(name, (e) => {
  type LocalStore = { localPeer: string; remotePeer: string };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs');
  const local = localstore.object({
    localPeer: cuid(),
    remotePeer: '',
  });

  const connections: DataConnection[] = [];
  let peer: Peer;
  const initPeer = (state: t.DevCtxState<T>, peerid: string) => {
    const options = Wrangle.toPeerOptions(DEFAULTS.signal);
    peer = new Peer(peerid, options);

    state.change((d) => {
      local.localPeer = peerid;
      d.peerid.local = peerid;
      d.options = options;
    });
    return peer;
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.peerid.local = local.localPeer;
      d.peerid.remote = local.remotePeer;
    });

    initPeer(state, state.current.peerid.local);

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

    dev.section('Peers', (dev) => {
      const placeholder = 'enter peer-id';

      dev.textbox((txt) => {
        const copy = () => navigator.clipboard.writeText(state.current.peerid.local);
        const regenerate = () => initPeer(state, cuid());
        txt
          .label((e) => 'local id')
          .placeholder(placeholder)
          .value((e) => e.state.peerid.local)
          .right((e) => (
            <div>
              <Button onClick={regenerate} margin={[0, 5, 0, 0]}>
                <Icons.Refresh size={16} tooltip={'New Peer ID'} />
              </Button>
              <Button onClick={copy}>
                <Icons.Copy size={16} tooltip={'Copy'} />
              </Button>
            </div>
          ))
          .onChange((e) => e.change((d) => (d.peerid.local = e.to.value)))
          .onEnter((e) => initPeer(state, state.current.peerid.local));
      });

      dev.hr(0, 10);

      dev.textbox((txt) => {
        const copy = () => navigator.clipboard.writeText(state.current.peerid.remote);
        txt
          .label((e) => 'remote id')
          .placeholder(placeholder)
          .value((e) => e.state.peerid.remote)
          .right((e) => (
            <div>
              <Button onClick={copy}>
                <Icons.Copy size={16} tooltip={'Copy'} />
              </Button>
            </div>
          ))
          .onChange((e) => e.change((d) => (local.remotePeer = d.peerid.remote = e.to.value)));
      });
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
            conn.on('open', () => {
              console.log('open', conn);
              conn.send(`hi from ${local}!`);
              connections.push(conn);
              dev.redraw();
            });
            await e.change((d) => (d.debug.connectingData = false));
          });
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
