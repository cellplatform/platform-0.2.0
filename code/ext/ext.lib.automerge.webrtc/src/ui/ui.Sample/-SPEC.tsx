import { Dev } from '../../test.ui';
import { A, WebStore, WebrtcNetworkAdapter, cuid, type t } from './common';
import { Sample } from './ui.Sample';

import type * as P from 'ext.lib.peerjs/src/types';

type T = {
  user?: string;
  docUri?: string;
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
  type LocalStore = { localPeer: string; remotePeer: string; docUri?: string };
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
  const store = WebStore.init({ network: [] });
  const generator = store.doc.factory<t.SampleDoc>((d) => (d.count = new A.Counter()));

  let doc: t.DocRefHandle<t.SampleDoc>;
  const initDoc = async (state: t.DevCtxState<T>) => {
    doc = await generator(local.docUri);
    local.docUri = doc.uri;
    state.change((d) => (d.docUri = doc.uri));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.docUri = local.docUri;
      d.peerid.local = local.localPeer;
      d.peerid.remote = local.remotePeer;
    });
    await initDoc(state);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([350, 150])
      .display('grid')
      .render<T>((e) => {
        return (
          <store.Provider>
            <Sample user={e.state.user} docUri={doc?.uri} />
          </store.Provider>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const { PeerDev } = await import('ext.lib.peerjs');
    PeerDev.peersSection({
      dev,
      state,
      local,
      onPeer: (p) => (peer = p),
    });

    dev.hr(0, 20);

    const addNetworkAdapter = (adapter: t.NetworkAdapter) => {
      store.repo.networkSubsystem.addNetworkAdapter(adapter);
      state.change((d) => (d.user = adapter.peerId));
    };

    dev.button(['addNetworkAdapter', 'remote-peer'], (e) => {
      if (!(peer && local.remotePeer)) return;
      const webrtc = new WebrtcNetworkAdapter(peer, local.remotePeer);
      addNetworkAdapter(webrtc);
    });

    dev.button(['addNetworkAdapter', '<undefined>'], (e) => {
      if (!peer) return;
      const webrtc = new WebrtcNetworkAdapter(peer);
      addNetworkAdapter(webrtc);
    });

    dev.hr(5, 20);

    dev.textbox((txt) => {
      txt
        .label((e) => 'docUri')
        .value((e) => e.state.docUri ?? '')
        .onChange((e) => e.change((d) => (d.docUri = e.to.value)))
        .onEnter((e) => {
          local.docUri = e.state.current.docUri || undefined;
          initDoc(state);
        });
    });

    dev.hr(0, 5);

    dev.button('new doc', async (e) => {
      local.docUri = undefined;
      await initDoc(state);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        user: e.state.user,
        docUri: e.state.docUri,
        peer,
        connections,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
