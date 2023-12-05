import { WebrtcStore } from '../../network.Webrtc';
import { Crdt, Dev, Doc, Hash, PropList, TestDb, Webrtc } from '../../test.ui';
import { type t } from './common';
import { Reload } from './ui.Reload';
import { Sample } from './ui.Sample';

type T = { debug: { reload?: boolean } };
const initial: T = { debug: {} };

const createEdge = async (kind: t.ConnectionEdgeKind) => {
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

  const network = await WebrtcStore.init(peer, store, repo.index);
  const edge: t.SampleEdge = { kind, repo, network };
  return edge;
};

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  const left = await createEdge('Left');
  const right = await createEdge('Right');

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const monitor = (edge: t.SampleEdge) => {
      const peer = edge.network.peer.events();
      const ephemeralDoc = edge.network.ephemeral.events();
      ephemeralDoc.changed$.subscribe(() => dev.redraw('debug'));
      peer.cmd.conn$.subscribe((e) => dev.redraw('debug'));
    };
    monitor(left);
    monitor(right);

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.debug.reload) return <Reload />;
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
        const docid = Crdt.Uri.id(edge.network.ephemeral.uri);
        return (
          <PropList
            items={[
              { label: 'peer', value: edge.network.peer.id },
              { label: 'doc/ephemeral', value: Hash.shorten(docid, 6) },
            ]}
          />
        );
      });

      dev.row((e) => {
        const data = edge.network.ephemeral.toObject();
        const shared = Object.keys(data.shared).reduce((acc, next) => {
          const key = `automerge:${Hash.shorten(Doc.Uri.id(next), 6)}`;
          (acc as any)[key] = data.shared[next];
          return acc;
        }, {});
        return (
          <Dev.Object
            data={{ ...data, shared }}
            style={{ marginTop: 8, marginLeft: 8 }}
            fontSize={11}
            expand={1}
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
        e.change((d) => (d.debug.reload = true));
      });

      dev.hr(-1, 5);
      dev.button('delete sample databases', async (e) => {
        await TestDb.EdgeSample.deleteDatabases();
        e.change((d) => (d.debug.reload = true));
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
