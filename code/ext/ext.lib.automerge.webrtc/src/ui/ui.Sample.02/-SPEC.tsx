import { Dev, IndexedDb } from '../../test.ui';
import { Crdt, Webrtc, DocUri } from './common';
import { Sample } from './ui.Sample';
import { WebrtcStore } from '../../network.Webrtc';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.02';

export default Dev.describe(name, async (e) => {
  const create = async (storage: string) => {
    const peer = Webrtc.peer();
    const store = Crdt.WebStore.init({ storage });
    const repo = await Crdt.RepoList.model(store);

    const monitor = WebrtcStore.monitor(peer, store);
    monitor.added$.subscribe((e) => {
      console.info('🌳 network adapter added:', peer.id, e);
    });

    return { peer, repo } as const;
  };

  const dbname = { left: 'dev.sample.left', right: 'dev.sample.right' } as const;
  const self = await create(dbname.left);
  const remote = await create(dbname.right);

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
        self.peer.connect.data(remote.peer.id);
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

    dev.button('tmp', async (e) => {
      const uri = self.repo.index.doc.uri;
      const doc = await remote.repo.store.doc.get(uri);
      console.log('doc', doc);
      doc?.events().changed$.subscribe((e) => {
        console.log('changed', e);
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
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
