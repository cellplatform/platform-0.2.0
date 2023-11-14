import { UI as Network } from 'ext.lib.peerjs';
import { Dev } from '../../test.ui';
import { Info } from '../ui.Info';
import { A, WebStore, cuid, type t } from './common';
import { Sample } from './ui.Sample';

type T = {
  user?: string;
  docUri?: string;
  peerid: { local: string; remote: string };
  options?: t.p.PeerJsOptions;
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
  const self = Network.peer();
  const remote = Network.peer();

  type LocalStore = { localPeer: string; remotePeer: string; docUri?: string };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.webrtc.Sample');
  const local = localstore.object({
    localPeer: cuid(),
    remotePeer: '',
    docUri: undefined,
  });

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

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => {
        return <Network.Connector peer={self} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <Info
          fields={['Module', 'Repo', 'Peer', 'Peer.Remotes']}
          data={{ peer: { self }, repo: { store } }}
        />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      return <Network.Dev.PeerCard peer={{ self: remote, remote: self }} />;
    });

    dev.hr(5, 20);

    const addNetworkAdapter = (adapter: t.NetworkAdapter) => {
      store.repo.networkSubsystem.addNetworkAdapter(adapter);
      state.change((d) => (d.user = adapter.peerId));
    };

    dev.button(['addNetworkAdapter', '<undefined>'], (e) => {
      // if (!peer) return;
      // const webrtc = new WebrtcNetworkAdapter(peer);
      // addNetworkAdapter(webrtc);
    });

    dev.button(['addNetworkAdapter', 'remote-peer'], (e) => {
      // if (!(peer && local.remotePeer)) return;
      // const webrtc = new WebrtcNetworkAdapter(peer, local.remotePeer);
      // addNetworkAdapter(webrtc);
    });

    dev.hr(5, 20);

    dev.textbox((txt) => {
      txt
        .label((e) => 'docUri')
        .value((e) => e.state.docUri ?? '')
        .onChange((e) => e.change((d) => (d.docUri = e.to.value)))
        .onEnter(async (e) => {
          // 🐷 Hack
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
        // peer,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
