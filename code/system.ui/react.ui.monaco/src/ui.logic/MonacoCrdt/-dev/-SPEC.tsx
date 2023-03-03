import { MonacoCrdt } from '..';
import { Dev, t, Value } from './common';
import { initSyncingCrdtDocs } from './DEV.crdt.mjs';
import { DevLayout } from './DEV.Layout';

type T = {
  redraw: number;
  tests: { running: boolean; results?: t.TestSuiteRunResponse };
  language: t.EditorLanguage;
};
const initial: T = {
  redraw: 0,
  tests: { running: false },
  language: 'typescript',
};

type LocalStore = { peerTotal: number; language: t.EditorLanguage };
type PeerItem = {
  peer: t.DevPeer;
  syncer?: t.MonacoCrdtSyncer<t.SampleDoc>;
};

export default Dev.describe('MonacoCrdt', (e) => {
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.monaco.crdt');
  const local = localstore.object({ peerTotal: 2, language: initial.language });

  const editors = new Set<t.MonacoCodeEditor>();
  const peerMap = new Map<string, PeerItem>();

  const disposeOf = (item: PeerItem) => {
    item.peer.doc.dispose();
    item.syncer?.dispose();
    console.log('dispose of', item);
  };

  const totalPeers = (length: number) => {
    local.peerTotal = length;
    const names = Array.from({ length }).map((_, i) => `Cell-${i + 1}`);

    peerMap.forEach((item) => disposeOf(item));
    peerMap.clear();
    initSyncingCrdtDocs(names).forEach((item) => {
      const { name, doc } = item;
      const peer = { name, doc };
      peerMap.set(name, { peer });
    });

    initEditorSyncers();
  };

  const initEditorSyncers = () => {
    Array.from(peerMap.entries()).forEach(([name, item], i) => {
      console.log('init', name);
      const peer = item.peer;
      const editor = Array.from(editors)[i];
      if (editor && !item.syncer) {
        const syncer = MonacoCrdt.syncer(editor, peer.doc, 'code', {});
        item.syncer = syncer;
        console.info('MonacoCrdt.syncer:', syncer);
      }
    });
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.language = local.language;
      totalPeers(local.peerTotal);
    });

    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const peers = Array.from(peerMap, (item) => item[1].peer);
        return (
          <DevLayout
            peers={peers}
            tests={e.state.tests}
            language={e.state.language}
            onDisposed={(e) => editors.delete(e.disposed.editor)}
            onReady={(e) => {
              console.log('⚡️ layout ready', e);
              e.editors.forEach((e) => editors.add(e.editor));
              initEditorSyncers();
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const redraw = () => dev.change((d) => d.redraw++);

    dev.footer.border(-0.1).render<T>((e) => {
      const data = {};
      peerMap.forEach((item) => {
        const key = item.peer.name;
        const doc = item.peer.doc.current;
        (data as any)[key] = doc;
      });
      return <Dev.Object name={'MonacoCrdt'} data={data} expand={1} />;
    });

    dev.section('Peers', (dev) => {
      const total = (total: number) => {
        const label = `${total} ${Value.plural(total, 'peer', 'peers')}`;
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => (peerMap.size === total ? 'current' : ''))
            .onClick((e) => e.change((d) => totalPeers(total))),
        );
      };

      total(0);
      dev.hr(-1, 5);
      total(1);
      total(2);
      total(3);
    });

    dev.hr(5, 20);

    dev.section('Unit Tests', async (dev) => {
      const run = async (bundle: t.BundleImport) => {
        const tests = (await bundle).default;
        await dev.change((d) => (d.tests.running = true));
        await dev.change(async (d) => {
          d.tests.results = await tests.run();
          d.tests.running = false;
        });
      };
      dev.button('run all tests', (e) => run(import('./-TEST.mjs')));
      dev.button('clear', (e) => e.change((d) => (d.tests = { ...initial.tests })));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const inc = (amount: number) => {
        dev.change((d) => {
          const peer = peerMap.get('Cell-1')?.peer;
          peer?.doc.change((d) => (d.count += amount));
          redraw();
        });
      };

      dev.button((btn) =>
        btn
          .label('increment count')
          .right('← on first Doc<T>')
          .onClick((e) => inc(1)),
      );
      dev.button((btn) =>
        btn
          .label('decrement count')
          .right('← on first Doc<T>')
          .onClick((e) => inc(-1)),
      );
    });

    dev.hr(5, 20);

    dev.section('Language', (dev) => {
      const language = (input: t.EditorLanguage | '---') => {
        if (input.startsWith('---')) return dev.hr(-1, 5);

        const language = input as t.EditorLanguage;
        return dev.button((btn) =>
          btn
            .label(language)
            .right((e) => (e.state.language === language ? 'current' : ''))
            .onClick((e) => {
              e.change((d) => (d.language = language));
              local.language = language;
            }),
        );
      };

      language('typescript');
      language('javascript');
      language('---');
      language('json');
      language('yaml');
      language('---');
      language('markdown');
    });
  });
});
