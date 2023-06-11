import { Dev, type t } from '.';

type T = { spinning?: boolean; results?: t.TestSuiteRunResponse[] };
const initial: T = {};

export default Dev.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
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

    dev.bdd((runner) =>
      runner
        .run({ label: 'Integration Tests' })
        .localstore('dev:sys.net.webrtc.testrunner')
        .modules(async () => (await import('./-TestRunner.TESTS.mjs')).TESTS.all)
        .onChanged((e) => state.change((d) => (d.results = e.results))),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { TestResults: e.state.results };
      return <Dev.Object name={'state'} data={data} expand={1} />;
    });
  });
});
