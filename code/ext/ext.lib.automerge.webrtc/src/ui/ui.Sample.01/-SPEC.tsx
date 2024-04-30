import { Peer, PeerUI } from 'ext.lib.peerjs';
import { Dev, Pkg, TestDb } from '../../test.ui';
import { Info } from '../ui.Info';
import { A, Doc, WebStore, WebrtcStore, type t } from './common';
import { Sample } from './ui.Sample';

type T = {
  user?: string;
  docuri?: string;
  debug: { connectingData?: boolean };
};
const initial: T = {
  debug: {},
};

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<T, 'docuri'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    docuri: undefined,
  });

  /**
   * Network Peers
   */
  const self = Peer.init();

  /**
   * CRDT (Automerge)
   */
  const storage = TestDb.EdgeSample.name;
  const store = WebStore.init({ network: [], storage });
  const index = await WebStore.index(store);
  const generator = store.doc.factory<t.SampleDoc>((d) => (d.count = new A.Counter()));

  let doc: t.DocRef<t.SampleDoc>;
  const initDoc = async (state: t.DevCtxState<T>) => {
    try {
      doc = await generator(local.docuri);
      local.docuri = doc.uri;
      state.change((d) => (d.docuri = doc.uri));
    } catch (error) {
      console.error('failed to load localstorage docuri:', local.docuri, error);
      local.docuri = undefined;
    }
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.docuri = local.docuri;
    });
    await initDoc(state);

    const network = await WebrtcStore.init(self, store, index);
    const events = network.events();
    events.added$.subscribe((e) => state.change((d) => (d.user = e.peer.remote)));

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
        return <PeerUI.Connector peer={self} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <Info
          fields={['Module', 'Repo', 'Peer', 'Peer.Remotes']}
          data={{
            peer: { self },
            repo: { store, index },
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.textbox((txt) => {
      txt
        .label((e) => 'Document URI')
        .value((e) => e.state.docuri ?? '')
        .onChange((e) => e.change((d) => (d.docuri = e.to.value)))
        .onEnter((e) => {
          // 🐷 Hack
          local.docuri = e.state.current.docuri || undefined;
          initDoc(state);
        });
    });

    dev.hr(0, 5);

    dev.button('new doc', async (e) => {
      local.docuri = undefined;
      await initDoc(state);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        user: e.state.user,
        docUri: Doc.Uri.shorten(e.state.docuri),
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
