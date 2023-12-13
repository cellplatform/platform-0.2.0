import { type t } from './common';

import { WebrtcStore } from '../../network.Webrtc';
import { Crdt, Delete, Dev, Doc, Hash, PropList, TestDb, Webrtc, rx } from '../../test.ui';
import { Sample } from './ui.Sample';

type T = { reload?: boolean };
const initial: T = {};

export const createEdge = async (kind: t.ConnectionEdgeKind) => {
  const db = TestDb.EdgeSample.edge(kind);
  const peer = Webrtc.peer();
  const store = Crdt.WebStore.init({
    storage: db.name,
    network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
  });
  const repo = await Crdt.RepoList.model(store);
  const network = await WebrtcStore.init(peer, store, repo.index, { debugLabel: kind });
  const edge: t.SampleEdge = { kind, repo, network };
  return edge;
};

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  let left: t.SampleEdge;
  let right: t.SampleEdge;
  let selected: { edge: t.ConnectionEdge; item: t.StoreIndexDoc } | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    left = await createEdge('Left');
    right = await createEdge('Right');

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    const resetReloadClose = () => state.change((d) => (d.reload = false));

    const monitor = (edge: t.SampleEdge) => {
      const redraw = () => dev.redraw('debug');
      const debounce = rx.debounceTime(50);
      const peer = edge.network.peer.events();
      const repo$ = edge.repo.events();
      peer.cmd.conn$.pipe(debounce).subscribe(redraw);
      edge.network.$.pipe(debounce).subscribe(redraw);
      repo$.active$.pipe(debounce).subscribe(redraw);
      repo$.active$.subscribe((e) => (selected = { edge, item: e.item }));
    };
    monitor(left);
    monitor(right);

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.UI.Reload onClose={resetReloadClose} />;
        } else {
          return <Sample left={left} right={right} />;
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Peers', (dev) => {
      const isConnected = () => left.network.peer.current.connections.length > 0;
      const disconnect = () => {
        left.network.peer.disconnect();
        state.change((d) => (d.reload = true));
      };

      const connectButton = (label: string, fn: () => void) => {
        dev.button((btn) => {
          btn
            .label(() => `connect: ${label}`)
            .right((e) => (!isConnected() ? '🌳' : ''))
            .enabled((e) => !isConnected())
            .onClick((e) => fn());
        });
      };

      connectButton('left → right', () => left.network.peer.connect.data(right.network.peer.id));
      connectButton('left ← right', () => right.network.peer.connect.data(left.network.peer.id));
      dev.hr(-1, 5);
      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'disconnect' : 'not connected'))
          .right((e) => (isConnected() ? '💥' : ''))
          .enabled((e) => isConnected())
          .onClick((e) => disconnect());
      });
    });

    dev.hr(5, 20);

    const edgeDebug = (edge: t.SampleEdge) => {
      dev.title(edge.kind);

      dev.row((e) => {
        const docid = Crdt.Uri.id(edge.network.shared?.uri);
        const doc = Hash.shorten(docid, [3, 5]);
        return (
          <PropList
            items={[
              { label: 'peer', value: edge.network.peer.id },
              { label: 'shared (sync document)', value: doc || '(not connected)' },
            ]}
          />
        );
      });

      dev.row((e) => {
        const formatUri = (uri: string) => Doc.Uri.automerge(uri, { shorten: 4 });
        const data = edge.network.shared?.toObject();
        if (!data?.docs) return null;

        const docs = { ...data?.docs };
        Object.keys(docs).forEach((uri) => {
          const value = docs[uri];
          docs[formatUri(uri)] = value;
          delete docs[uri];
        });

        return (
          <Dev.Object
            name={'Shared'}
            data={{ ...data, docs }}
            fontSize={11}
            style={{ marginTop: 8, marginLeft: 8 }}
            expand={{ level: 1, paths: ['$', '$.docs'] }}
          />
        );
      });
    };

    edgeDebug(left);
    dev.hr(-1, 20);
    edgeDebug(right);

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.hr(5, 20);

      dev.button('purge ephemeral', (e) => {
        const purge = (edge: t.SampleEdge) => WebrtcStore.Shared.purge(edge.repo.index);
        purge(left);
        purge(right);
        e.change((d) => (d.reload = true));
      });

      dev.hr(-1, 5);

      const deleteButton = (label: string, fn: () => Promise<any>) => {
        dev.button([`delete db: ${label}`, '💥'], async (e) => {
          await e.change((d) => (d.reload = true));
          await fn();
        });
      };
      deleteButton('all', TestDb.EdgeSample.deleteDatabases);
      deleteButton(TestDb.EdgeSample.left.name, TestDb.EdgeSample.left.deleteDatabase);
      deleteButton(TestDb.EdgeSample.right.name, TestDb.EdgeSample.right.deleteDatabase);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const total = (edge: t.SampleEdge) => edge.repo.index.doc.current.docs.length;
      const shorten = (uri: string) => Crdt.Uri.id(uri, { shorten: 6 });
      const formatEdge = (edge: t.SampleEdge) => {
        return {
          total: total(edge),
          index: edge.repo.index.doc.current,
          'index:uri': shorten(edge.repo.index.doc.uri),
        };
      };

      const formatSelected = (item?: t.StoreIndexDoc) => {
        if (!item) return;

        const shared = item.shared
          ? { ...item.shared, version: item.shared.version.value }
          : undefined;

        return {
          ...item,
          uri: Crdt.Uri.automerge(item.uri, { shorten: 6 }),
          shared,
        };
      };

      const data = {
        [`left[${total(left)}]`]: formatEdge(left),
        [`right[${total(right)}]`]: formatEdge(right),
        [`selected:edge`]: selected ? selected.edge.kind : undefined,
        [`selected:uri`]: selected
          ? Doc.Uri.automerge(selected.item.uri, { shorten: 4 })
          : undefined,
        [`selected`]: formatSelected(selected?.item),
      };
      return (
        <Dev.Object
          name={name}
          data={Delete.empty(data)}
          fontSize={11}
          expand={{
            level: 1,
            paths: [
              '$',
              // '$.selected',
              // '$.selected.shared',
            ],
          }}
        />
      );
    });
  });
});
