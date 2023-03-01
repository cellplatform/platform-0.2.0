import { t, Dev, css, Color, COLORS, Value, Crdt, Automerge } from './common';
import { DevLayout, DevLayoutProps } from './DEV.Layout';
import { MonacoCrdt } from '..';

type T = {
  peerNames: string[];
  docs: t.CrdtDocRef<t.SampleDoc>[];
  tests: { running: boolean; results?: t.TestSuiteRunResponse };
};
const initial: T = { peerNames: [], docs: [], tests: { running: false } };

export default Dev.describe('MonacoCrdt', (e) => {
  type LocalStore = { peerTotal: number };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.monaco.crdt');
  const local = localstore.object({ peerTotal: 2 });

  const setPeerTotal = async (length: number, state: T) => {
    local.peerTotal = length;
    state.peerNames = Array.from({ length }).map((_, i) => `Peer-${i + 1}`);

    state.docs.forEach((doc) => doc.dispose());
    state.docs = state.peerNames.map(() => {
      return Crdt.Doc.ref<t.SampleDoc>({
        count: 0,
        code: new Automerge.Text(),
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
        return (
          <DevLayout
            peerNames={e.state.peerNames}
            tests={e.state.tests}
            onReady={(e) => {
              console.log('⚡️ layout ready', e);
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const docs = e.state.docs.map((doc) => doc.current);
      const data = { docs };
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
  });
});
