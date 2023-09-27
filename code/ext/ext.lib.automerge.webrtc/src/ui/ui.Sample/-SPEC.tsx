import { Dev } from '../../test.ui';
import { A, RepoContext, WebStore, cuid, type t, WebrtcNetworkAdapter } from './common';
import { Sample } from './ui.Sample';

import type * as P from 'ext.lib.peerjs/src/types';

type T = {
  docUri?: t.DocUri;
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
  type LocalStore = { localPeer: string; remotePeer: string; docUri?: t.DocUri };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs');
  const local = localstore.object({
    localPeer: cuid(),
    remotePeer: '',
    docUri: undefined,
  });

  /**
   * WebRTC
   */
  const connections: P.DataConnection[] = [];
  let peer: P.Peer;

  /**
   * CRDT (Automerge)
   */
  const webrtc = new WebrtcNetworkAdapter();
  const store = WebStore.init({ network: [webrtc] });
  const generator = store.doc.factory<t.SampleDoc>((d) => (d.count = new A.Counter()));

  let doc: t.DocRefHandle<t.SampleDoc>;
  const initDoc = async (state: t.DevCtxState<T>) => {
    doc = await generator(local.docUri);
    state.change((d) => (local.docUri = d.docUri = doc.uri));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.docUri = local.docUri;
    });
    await initDoc(state);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([350, 150])
      .display('grid')
      .render<T>((e) => {
        if (!doc) return null;
        return (
          <RepoContext.Provider value={store.repo}>
            <Sample docUri={doc.uri} />
          </RepoContext.Provider>
        );
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
      const data = {
        docUri: e.state.docUri,
        peer,
        connections,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
