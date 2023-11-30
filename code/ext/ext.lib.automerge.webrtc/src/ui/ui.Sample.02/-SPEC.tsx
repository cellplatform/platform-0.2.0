import { WebrtcStore } from '../../network.Webrtc';
import { Crdt, Dev, Hash, PropList, TestDb, Webrtc } from '../../test.ui';
import { type t } from './common';
import { Sample } from './ui.Sample';

type T = {};
const initial: T = {};

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
      const ephemeral = edge.network.ephemeral.events();
      ephemeral.changed$.subscribe(() => dev.redraw('debug'));
    };
    monitor(left);
    monitor(right);

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => <Sample left={left} right={right} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Peers', (dev) => {
      dev.button('connect', (e) => left.network.peer.connect.data(right.network.peer.id));
      dev.button('disconnect', (e) => left.network.peer.disconnect());
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
        const data = edge.network.ephemeral.current;
        return <Dev.Object data={data} style={{ marginTop: 8, marginLeft: 8 }} fontSize={11} />;
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
        dev.redraw();
      });

      dev.hr(-1, 5);
      dev.button('delete sample databases', () => TestDb.EdgeSample.deleteDatabases());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const format = (edge: t.SampleEdge) => {
        const uri = edge.repo.index.doc.uri;
        const index = Crdt.Uri.id(uri, { shorten: 4 });
        const total = edge.repo.index.doc.current.docs.length;
        return {
          total,
          'index:uri': Crdt.Uri.id(uri, { shorten: 6 }),
          index: edge.repo.index.doc.current,
        };
      };
      const data = {
        self: format(left),
        remote: format(right),
      };
      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.self'] }} />;
    });
  });
});
