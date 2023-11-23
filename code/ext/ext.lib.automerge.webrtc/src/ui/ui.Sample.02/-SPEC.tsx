import { WebrtcStore } from '../../network.Webrtc';
import { Dev, IndexedDb } from '../../test.ui';
import { Crdt, DocUri, Webrtc, type t } from './common';
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
      onDatabaseClick(e) {
        console.info(`⚡️ onDatabaseClick`, e);
      },
      onShareClick(e) {
        console.info(`⚡️ onShareClick`, e);
        const uri = e.item.uri;
        const name = e.item.name;

        // peer.connect.data(e.item.id);
        peer.current.connections.forEach((e) => {
          console.log('peer.get.conn.remotes', peer.get.conn.remotes);

          const conn = peer.get.conn.obj.data(e.id);
          console.log('conn', e, conn);
          if (conn) {
            // conn.
            conn.send({ kind: 'share:doc', uri, name });
          }
        });
        // peer.get.conn.
      },
    });

    peer.events().cmd.data$.subscribe(async (e) => {
      const payload = e.data as any;
      if (payload.kind === 'share:doc') {
        const uri = payload.uri;
        if (Crdt.Is.automergeUrl(uri)) {
          console.log('-------------------------------------------');
          // const m = await store.doc.get(uri);
          // console.log('m', m);
          const exists = await store.doc.exists(uri);
          // console.log('uri', uri);/
          console.log('exists', peer.id, exists, uri);
          if (!repo.index.exists(uri)) {
            repo.index.doc.change((d) => d.docs.push({ uri }));
          }
        }
        // if (DocUri.)
        // Webrtc.is
      }
      // store.doc.get()
    });

    const network = WebrtcStore.init(peer, store);

    const edge: t.SampleEdge = { kind, repo, network };
    return edge;
  };

  const dbname = {
    left: 'dev.sample.left',
    right: 'dev.sample.right',
  } as const;
  const self = await create('Left', dbname.left);
  const remote = await create('Right', dbname.right);

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Sample left={self} right={remote} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.button('connect (peers)', async (e) => {
        self.network.peer.connect.data(remote.network.peer.id);
      });

      dev.hr(-1, 5);

      dev.button('delete sample databases', async (e) => {
        const del = async (name: string) => {
          await IndexedDb.delete(name);
          await IndexedDb.delete(Crdt.WebStore.IndexDb.name(name));
        };
        await del(dbname.left);
        await del(dbname.right);
      });
    });

    dev.hr(5, 20);

    dev.button('tmp: conn.send', async (e) => {
      const peer = self.network.peer;
      const conn = peer.current.connections.find((m) => m.kind === 'data');
      const data = peer.get.conn.obj.data(conn?.id);
      if (data) {
        data.send({ msg: 'hello' });
      }
    });

    const getDoc = async (edge: t.SampleEdge) => {
      type D = { count: number };
      const repo = edge.repo;
      const uri = repo.index.doc.current.docs[0]?.uri;
      const doc = await repo.store.doc.get<D>(uri);
      return doc;
    };

    const increment = async (edge: t.SampleEdge) => {
      const doc = await getDoc(edge);
      doc?.change((d) => {
        if (typeof d.count !== 'number') d.count = 0;
        d.count++;
      });
    };

    const monitor = async (edge: t.SampleEdge) => {
      const doc = await getDoc(edge);
      doc?.events().changed$.subscribe((e) => {
        console.log('⚡️', edge.kind, doc.toObject());
      });
    };

    dev.hr(-1, 5);
    dev.button('left: increment', (e) => increment(self));
    dev.button('right: increment', (e) => increment(remote));
    dev.hr(-1, 5);
    dev.button('monitor: left', (e) => monitor(self));
    dev.button('monitor: right', (e) => monitor(remote));
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const format = (uri: string) => DocUri.id(uri, { shorten: 4 });
      const data = {
        self: { index: format(self.repo.index.doc.uri) },
        remote: { index: format(remote.repo.index.doc.uri) },
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
