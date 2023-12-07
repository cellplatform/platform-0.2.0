import { type t } from './common';

import { WebrtcStore } from '../../network.Webrtc';
import { Crdt, Dev, Doc, Hash, PropList, TestDb, Webrtc, rx } from '../../test.ui';
import { Reload } from './ui.Reload';
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
  const repo = await Crdt.RepoList.model(store, {
    // onDatabaseClick: (e) => console.info(`⚡️ onDatabaseClick`, e),
    // onShareClick: (e) => console.info(`⚡️ onShareClick`, e),
  });

  const label = kind;
  const network = await WebrtcStore.init(peer, store, repo.index, { label });
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

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    left = await createEdge('Left');
    right = await createEdge('Right');

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const monitor = (edge: t.SampleEdge) => {
      const redraw = () => dev.redraw('debug');
      const peer = edge.network.peer.events();
      peer.cmd.conn$.subscribe(redraw);
      edge.network.$.pipe(rx.debounceTime(50)).subscribe(redraw);
    };
    monitor(left);
    monitor(right);

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) return <Reload />;
        return <Sample left={left} right={right} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Peers', (dev) => {
      const connect = () => left.network.peer.connect.data(right.network.peer.id);
      const disconnect = () => left.network.peer.disconnect();
      const isConnected = () => left.network.peer.current.connections.length > 0;

      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'connected' : 'connect'))
          .right((e) => (!isConnected() ? '🌳' : ''))
          .enabled((e) => !isConnected())
          .onClick((e) => connect());
      });
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
        const docid = Crdt.Uri.id(edge.network.syncdoc?.uri);
        const doc = Hash.shorten(docid, [3, 5]);
        return (
          <PropList
            items={[
              { label: 'peer', value: edge.network.peer.id },
              { label: 'syncdoc / ephemeral', value: doc || '-' },
            ]}
          />
        );
      });

      dev.row((e) => {
        const formatUri = (uri: string) => `automerge:${Hash.shorten(Doc.Uri.id(uri), 4)}`;
        const data = edge.network.syncdoc?.toObject();

        if (!data?.shared) return null;

        const shared = { ...data?.shared };
        Object.keys(shared).forEach((key) => {
          const value = shared[key];
          shared[formatUri(key)] = value;
          delete shared[key];
        });

        return (
          <Dev.Object
            name={'SyncDoc'}
            data={{ ...data, shared }}
            fontSize={11}
            style={{ marginTop: 8, marginLeft: 8 }}
            expand={{ level: 1, paths: ['$', '$.shared'] }}
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
        const purge = (edge: t.SampleEdge) => WebrtcStore.SyncDoc.purge(edge.repo.index);
        purge(left);
        purge(right);
        e.change((d) => (d.reload = true));
      });

      dev.hr(-1, 5);
      dev.button(['delete sample databases', '💥'], async (e) => {
        await TestDb.EdgeSample.deleteDatabases();
        e.change((d) => (d.reload = true));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const total = (edge: t.SampleEdge) => {
        return edge.repo.index.doc.current.docs.length;
      };

      const format = (edge: t.SampleEdge) => {
        const uri = edge.repo.index.doc.uri;
        return {
          total: total(edge),
          'index:uri': Crdt.Uri.id(uri, { shorten: 6 }),
          index: edge.repo.index.doc.current,
        };
      };
      const data = {
        [`left[${total(left)}]`]: format(left),
        [`right[${total(right)}]`]: format(right),
      };
      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.self'] }} />;
    });
  });
});
