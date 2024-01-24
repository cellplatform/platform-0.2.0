import { MonacoCrdt } from '..';
import { rx, Dev, t, Value, CrdtViews } from './-common';
import { initDocsWithPeerSyncers } from './DEV.crdt.mjs';
import { DevLayout } from './DEV.Layout';

type T = {
  language: t.EditorLanguage;
  tests: { running: boolean; results?: t.TestSuiteRunResponse };
  debug: { showTests: boolean; initialValue: boolean };
};
const initial: T = {
  language: 'yaml',
  tests: { running: false },
  debug: { showTests: true, initialValue: true },
};

type LocalStore = {
  peerTotal: number;
  language: t.EditorLanguage;
  showTests: boolean;
  initialValue: boolean;
};
type PeerItem = {
  peer: t.DevPeer;
  syncer?: t.MonacoCrdtSyncer;
};

export default Dev.describe('MonacoCrdt', (e) => {
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.monaco.crdt');
  const local = localstore.object({
    peerTotal: 2,
    language: initial.language,
    showTests: initial.debug.showTests,
    initialValue: initial.debug.initialValue,
  });

  let monaco: t.Monaco;
  const editors = new Set<t.MonacoCodeEditor>();
  const peerMap = new Map<string, PeerItem>();

  const disposeOf = (item: PeerItem) => {
    item.peer.doc.dispose();
    item.syncer?.dispose();
    console.log('dispose of', item);
  };

  const totalPeers = (ctx: t.DevCtx, state: T, length: number) => {
    local.peerTotal = length;
    const names = Array.from({ length }).map((_, i) => `Cell-${i + 1}`);

    peerMap.forEach((item) => disposeOf(item));
    peerMap.clear();

    const initial = state.debug.initialValue ? 'Hello World' : undefined;
    initDocsWithPeerSyncers(names, { initial }).forEach((item) => {
      const { name, doc } = item;
      const peer = { name, doc };
      peerMap.set(name, { peer });
    });

    initSyncers(ctx);
  };

  const initSyncers = (ctx: t.DevCtx) => {
    Array.from(peerMap.entries()).forEach(([name, item], i) => {
      console.log(`init peer: "${name}"`);

      const peer = item.peer;
      const editor = Array.from(editors)[i];

      if (editor && !item.syncer) {
        const doc = peer.doc;
        const syncer = MonacoCrdt.syncer({
          monaco,
          editor,
          data: { doc, getText: (doc) => doc.code },
          peers: { local: peer.name, doc, getPeers: (doc) => doc.peers },
        });
        item.syncer = syncer;
        console.info('MonacoCrdt.syncer:', syncer);

        syncer.$.pipe(rx.throttleTime(500)).subscribe(() => ctx.redraw());
      }
    });
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.language = local.language;
      d.debug.showTests = local.showTests;
      d.debug.initialValue = local.initialValue;
      totalPeers(ctx, d, local.peerTotal);
    });

    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const peers = Array.from(peerMap, (item) => item[1].peer);
        return (
          <DevLayout
            peers={peers}
            tests={e.state.debug.showTests ? e.state.tests : undefined}
            language={e.state.language}
            onDisposed={(e) => editors.delete(e.disposed.editor)}
            onReady={(e) => {
              console.log('⚡️ layout ready', e);
              monaco = e.monaco;
              e.editors.forEach((e) => editors.add(e.editor));
              initSyncers(ctx);
            }}
          />
        );
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header.border(-0.1).render((e) => {
      return <CrdtViews.Info style={{ Margin: [0, 20] }} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const ctx = dev.ctx;
    const redraw = () => ctx.redraw();

    dev.section('Peers', (dev) => {
      const total = (total: number) => {
        const label = `${total} ${Value.plural(total, 'peer', 'peers')}`;
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => (peerMap.size === total ? '← current' : ''))
            .onClick((e) => e.change((d) => totalPeers(ctx, e.state.current, total))),
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
      const wrangleTestCtx = async () => {
        await dev.change((d) => totalPeers(dev.ctx, d, 2));

        const peer = (index: number): t.TestPeer => {
          const editor = Array.from(editors)[index];
          const peer = Array.from(peerMap)[index][1].peer;
          const { doc } = peer;
          return { editor, doc };
        };

        const ctx: t.TestCtx = {
          peer1: peer(0),
          peer2: peer(1),
        };
        return ctx;
      };

      const run = async (bundle: t.BundleImport) => {
        const tests = (await bundle).default as t.TestSuiteModel;
        const ctx = await wrangleTestCtx();
        await dev.change((d) => (d.tests.running = true));
        await dev.change(async (d) => {
          d.tests.results = await tests.run({ ctx });
          d.tests.running = false;
        });
      };

      dev.boolean((btn) =>
        btn
          .label((e) => (e.state.debug.showTests ? 'hide tests' : 'show tests'))
          .value((e) => e.state.debug.showTests)
          .onClick((e) => {
            e.change((d) => {
              const next = Dev.toggle(d.debug, 'showTests');
              local.showTests = next;
            });
          }),
      );

      dev.hr(-1, 5);

      dev.button('run tests', async (e) => {
        await e.change((d) => (d.debug.showTests = true));
        await run(import('./-TEST'));
      });
      dev.button('clear', (e) => e.change((d) => (d.tests = { ...initial.tests })));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `initial value`)
          .value((e) => e.state.debug.initialValue)
          .onClick((e) =>
            e.change((d) => (local.initialValue = Dev.toggle(d.debug, 'initialValue'))),
          ),
      );

      dev.hr(-1, 5);

      const inc = (by: number) => {
        dev.change((d) => {
          const peer = peerMap.get('Cell-1')?.peer;
          peer?.doc.change((d) => (d.count += by));
          redraw();
        });
      };
      const incButton = (by: number, label: string) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right('← on first Doc<T>')
            .onClick((e) => inc(by)),
        );
      };
      incButton(1, 'increment: count + 1');
      incButton(1, 'decrement: count - 1');

      dev.hr(-1, 5);

      dev.button('redraw', (e) => dev.ctx.redraw());
    });

    dev.hr(5, 20);

    dev.section('Language', (dev) => {
      const hr = () => dev.hr(-1, 5);
      const language = (input: t.EditorLanguage) => {
        const language = input as t.EditorLanguage;
        return dev.button((btn) =>
          btn
            .label(language)
            .right((e) => (e.state.language === language ? '← current' : ''))
            .onClick((e) => {
              e.change((d) => (d.language = language));
              local.language = language;
            }),
        );
      };

      language('typescript');
      hr();
      language('json');
      language('yaml');
      hr();
      language('markdown');
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data: { [key: string]: any } = {};

      peerMap.forEach(({ peer }) => {
        const key = peer.name;
        const doc = peer.doc.current;
        const text = doc.code.toString();

        data[key] = {
          ...doc,
          code: `chars:(${text.length}), lines:(${text.split('\n').length})`,
        };
      });
      return <Dev.Object name={'MonacoCrdt'} data={data} expand={2} />;
    });
  });
});
