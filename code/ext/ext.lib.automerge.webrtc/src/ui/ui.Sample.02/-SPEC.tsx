import { WebrtcStore } from '../../network.Webrtc';
import { css, Dev, TestDb } from '../../test.ui';
import { Crdt, DocUri, Webrtc, type t, Hash, PropList } from './common';
import { Sample } from './ui.Sample';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  const create = async (kind: t.SampleEdge['kind'], storage: string) => {
    const peer = Webrtc.peer();
    const store = Crdt.WebStore.init({
      storage,
      network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
    });
    const repo = await Crdt.RepoList.model(store, {
      onDatabaseClick: (e) => console.info(`⚡️ onDatabaseClick`, e),
      onShareClick: (e) => console.info(`⚡️ onShareClick`, e),
    });

    const network = await WebrtcStore.init(peer, store, repo.index);
    const edge: t.SampleEdge = { kind, repo, network };
    return edge;
  };

  const self = await create('Left', TestDb.EdgeSample.left.name);
  const remote = await create('Right', TestDb.EdgeSample.right.name);

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const monitor = (edge: t.SampleEdge) => {
      const ephemeral = edge.network.ephemeral.events();
      ephemeral.changed$.subscribe(() => dev.redraw());
    };
    monitor(self);
    monitor(remote);

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => <Sample left={self} right={remote} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.button('connect (peers)', async (e) => {
      self.network.peer.connect.data(remote.network.peer.id);
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
    edgeDebug(self);
    dev.hr(-1, 20);
    edgeDebug(remote);

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.hr(5, 20);

      dev.button('purge ephemeral', (e) => {
        const purge = (edge: t.SampleEdge) => WebrtcStore.Ephemeral.purge(edge.repo.index);
        purge(self);
        purge(remote);
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
        const index = DocUri.id(uri, { shorten: 4 });
        const total = edge.repo.index.doc.current.docs.length;
        return {
          total,
          'index:uri': DocUri.id(uri, { shorten: 6 }),
          index: edge.repo.index.doc.current,
        };
      };
      const data = {
        self: format(self),
        remote: format(remote),
      };
      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.self'] }} />;
    });
  });
});
