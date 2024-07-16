import { Peer, PeerUI } from 'ext.lib.peerjs';
import { Dev, Pkg, TestDb } from '../../test.ui';
import { Info } from '../ui.Info';
import { A, Doc, WebStore, WebrtcStore, type t } from './common';
import { Sample } from './ui.Sample';

type T = {
  user?: string;
  docuri?: string;
  reload?: boolean;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<T, 'docuri'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ docuri: undefined });

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

  let _doc: t.Doc<t.SampleDoc> | undefined;
  const initDoc = async (state: t.DevCtxState<T>) => {
    try {
      const doc = await generator(local.docuri);
      state.change((d) => (local.docuri = d.docuri = doc.uri));
    } catch (error) {
      console.error('failed to load localstorage docuri:', local.docuri, error);
      local.docuri = undefined;
    }
  };
  const updateDoc = async (uri?: t.UriString) => {
    if (!uri) return;
    _doc = await store.doc.get<t.SampleDoc>(uri);
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.docuri = local.docuri;
    });

    const exists = await store.doc.exists(local.docuri);
    if (!exists) await initDoc(state);

    const network = await WebrtcStore.init(self, store, index);
    const events = network.events();
    events.added$.subscribe((e) => state.change((d) => (d.user = e.peer.remote)));

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([350, 150])
      .display('grid')
      .render<T>(async (e) => {
        if (e.state.reload) {
          return <TestDb.DevReload onCloseClick={() => state.change((d) => (d.reload = false))} />;
        } else {
          await updateDoc(e.state.docuri);
          return <Sample user={e.state.user} doc={_doc} />;
        }
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={self} />);
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

    dev.section(['Document URI', 'CRDT'], (dev) => {
      dev.textbox((txt) => {
        txt
          .value((e) => e.state.docuri ?? '')
          .onChange((e) => e.change((d) => (d.docuri = e.to.value)))
          .onEnter((e) => {
            // 🐷 Hack.
            local.docuri = e.state.current.docuri || undefined;
            initDoc(state);
          });
      });

      dev.hr(0, 8);
      dev.button(['copy', 'clipboard'], (e) => {
        const uri = e.state.current.docuri || '';
        navigator.clipboard.writeText(uri);
      });
      dev.button(['create new', '🌳'], async (e) => {
        local.docuri = undefined;
        await initDoc(state);
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button(['purge ephemeral', '💦'], (e) => {
        WebrtcStore.Shared.purge(index);
        e.change((d) => (d.reload = true));
      });
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
