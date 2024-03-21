import { Dev, TestDb, type t } from '.';

type T = {
  spinning?: boolean;
  results?: t.TestSuiteRunResponse[];
  reload?: boolean;
};
const initial: T = {};

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.debug.width(350);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        if (e.state.reload)
          return <TestDb.DevReload onCloseClick={() => state.change((d) => (d.reload = false))} />;

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
        .run({})
        .modules(async () => (await import('./-TestRunner.TESTS')).TESTS.all)
        .localstore('dev:ext.lib.automerge')
        .keyboard(true)
        .onChanged((e) => state.change((d) => (d.results = e.results))),
    );

    dev.hr(5, 20);

    dev.section('Maintenance', (dev) => {
      const del = (label: string, fn: () => Promise<void>) => {
        dev.button([label, '💥'], async (e) => {
          await fn();
          await e.state.change((d) => (d.reload = true));
        });
      };

      del('delete all "test" databases', () => TestDb.deleteDatabases());
      del('delete "spec" (dev harness) databases', () => TestDb.Spec.deleteDatabase());
      dev.hr(-1, 5);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { Results: e.state.results };
      return <Dev.Object name={'TestRunner'} data={data} expand={1} />;
    });
  });
});
