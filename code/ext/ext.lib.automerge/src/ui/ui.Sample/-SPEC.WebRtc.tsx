import { css, Dev, type t, cuid } from '../../test.ui';

import type * as P from 'ext.lib.peerjs/src/types';

type T = {
  peerid: { local: string; remote: string };
  options?: P.PeerOptions;
};
const initial: T = {
  peerid: { local: '', remote: '' },
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
