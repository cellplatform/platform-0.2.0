import { rx, t, Dev, css, Color, COLORS, Value, Crdt, Automerge } from './common';
import { DevLayout } from './DEV.Layout';
import { MonacoCrdt } from '..';

type T = {
  redraw: number;
  peerNames: string[];
  tests: { running: boolean; results?: t.TestSuiteRunResponse };
};
const initial: T = { redraw: 0, peerNames: [], tests: { running: false } };

export default Dev.describe('MonacoCrdt', (e) => {
  type LocalStore = { peerTotal: number };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.monaco.crdt');
  const local = localstore.object({ peerTotal: 2 });

  let _docs: t.CrdtDocRef<t.SampleDoc>[] = [];

  const setPeerTotal = async (length: number, state: T) => {
    local.peerTotal = length;
    state.peerNames = Array.from({ length }).map((_, i) => `Peer-${i + 1}`);

    _docs.forEach((doc) => doc.dispose());
    _docs = state.peerNames.map((_, i) => {
      return Crdt.Doc.ref<t.SampleDoc>({
        count: 0,
        code: new Automerge.Text(),
      });
    });

    _docs.forEach((docA) => {
      const others = _docs.filter((d) => d !== docA);
      others.forEach((docB) => {
        const busA = rx.bus();
        const busB = rx.bus();
        const conn = rx.bus.connect([busA, busB]);

        const syncA = Crdt.Doc.sync(busA, docA);
        const syncB = Crdt.Doc.sync(busB, docB);

        const dispose = () => {
          conn.dispose();
          syncA.dispose();
          syncB.dispose();
        };

        docA.dispose$.subscribe(dispose);
        docB.dispose$.subscribe(dispose);
      });
    });
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => setPeerTotal(local.peerTotal, d));

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const names = e.state.peerNames;
        const peers = _docs.map((doc, i) => ({ doc, name: names[i] }));
        return (
          <DevLayout
            peers={peers}
            tests={e.state.tests}
            onReady={(e) => {
              console.log('⚡️ layout ready', e);

              e.editors.forEach((e) => {
                const doc = e.peer.doc;
                const editor = e.editor;
                const crdt = MonacoCrdt.init(doc, 'code', editor);
                console.info('MonacoCrdt:', crdt);
              });
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
      const docs = _docs.map((doc) => doc.current);
      docs.forEach((doc, i) => {
        const peer = e.state.peerNames[i];
        (data as any)[peer] = doc;
      });
      return <Dev.Object name={'MonacoCrdt'} data={data} expand={1} />;
    });

    dev.section('Peers', (dev) => {
      const total = (total: number) => {
        const label = `${total} ${Value.plural(total, 'peer', 'peers')}`;
        dev.button(label, (e) => e.change((d) => setPeerTotal(total, d)));
      };
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
          _docs[0].change((d) => (d.count += amount));
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

      dev.hr();
    });
  });
});
