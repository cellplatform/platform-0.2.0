import { css, Dev, type t, cuid } from '../../test.ui';

import type * as P from 'ext.lib.peerjs/src/types';

type T = {
  peerid: { local: string; remote: string };
  options?: P.PeerOptions;
  debug: { connectingData?: boolean };
};
const initial: T = {
  peerid: { local: '', remote: '' },
  debug: {},
};

/**
 * Spec
 */
const name = 'Sample.WebRtc';

export default Dev.describe(name, (e) => {
  type LocalStore = { localPeer: string; remotePeer: string };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs');
  const local = localstore.object({
    localPeer: cuid(),
    remotePeer: '',
  });

  const connections: P.DataConnection[] = [];
  let peer: P.Peer;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const { PeerDev } = await import('ext.lib.peerjs');
    PeerDev.peersSection(dev, state, local, (p) => (peer = p));

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
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        peer,
        connections,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
