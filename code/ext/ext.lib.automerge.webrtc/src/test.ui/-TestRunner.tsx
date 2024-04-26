import { Dev, TestEdge, type t } from '.';

type T = {
  spinning?: boolean;
  results?: t.TestSuiteRunResponse[];
};
const initial: T = {};

export default Dev.describe('TestRunner', async (e) => {
  const left = await TestEdge.createEdge('Left');
  const right = await TestEdge.createEdge('Right');

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.debug.width(370);
    ctx.subject
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

    TestEdge.dev.headerFooterConnectors(dev, left.network, right.network);

    dev.hr(0, 5);
    dev.title('Test Runner');
    dev.bdd((runner) =>
      runner
        .run({})
        .modules(async () => (await import('./-TestRunner.TESTS')).TESTS.all)
        .localstore('dev:ext.lib.automerge.webrtc')
        .keyboard(true)
        .onChanged((e) => state.change((d) => (d.results = e.results))),
    );

    dev.hr(5, 20);
    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      TestEdge.dev.peersSection(dev, left.network, right.network);
    });
  });
});
