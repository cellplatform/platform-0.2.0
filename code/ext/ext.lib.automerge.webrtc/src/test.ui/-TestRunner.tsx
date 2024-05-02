import { Dev, Pkg, TestEdge, type t } from '.';

type T = {
  spinning?: boolean;
  results?: t.TestSuiteRunResponse[];
  useExistingConnections?: boolean;
};
const initial: T = {};

export default Dev.describe('TestRunner', async (e) => {
  const left = (await TestEdge.createEdge('Left')).network;
  const right = (await TestEdge.createEdge('Right')).network;

  type LocalStore = Pick<T, 'useExistingConnections'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ useExistingConnections: false });

  e.it('init', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    state.change((d) => {
      d.useExistingConnections = local.useExistingConnections;
    });

    dev.ctx.debug.width(370);
    dev.ctx.subject
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        const { spinning, results } = e.state;
        return (
          <Dev.TestRunner.Results
            style={{ Absolute: 0 }}
            data={results}
            spinning={spinning}
            scroll={true}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    TestEdge.dev.headerFooterConnectors(dev, left, right);

    dev.hr(0, 5);
    dev.title('Test Runner');
    dev.bdd((runner) => {
      const ctx = (): t.TestCtx => {
        const useExistingConnections = state.current.useExistingConnections ?? false;
        return {
          left,
          right,
          useExistingConnections,
          async connect(direction = 'L2R') {
            if (state.current.useExistingConnections) return;
            const connect = async (a: t.PeerModel, b: t.PeerModel) => a.connect.data(b.id);
            if (direction === 'L2R') await connect(left.peer, right.peer);
            if (direction === 'R2L') await connect(right.peer, left.peer);
          },
          async disconnect(force) {
            if (state.current.useExistingConnections && !force) return;
            left.peer.disconnect();
            right.peer.disconnect();
          },
        };
      };

      runner
        .run({ ctx })
        .modules(async () => (await import('./-TestRunner.TESTS')).TESTS.all)
        .localstore('dev:ext.lib.automerge.webrtc')
        .keyboard(true)
        .onChanged((e) => state.change((d) => (d.results = e.results)));
    });

    dev.hr(5, 20);
    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.useExistingConnections;
        btn
          .label((e) => `use existing connections`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              local.useExistingConnections = Dev.toggle(d, 'useExistingConnections');
            }),
          );
      });
      dev.hr(-1, 5);
      TestEdge.dev.peersSection(dev, left, right);
    });
  });
});
