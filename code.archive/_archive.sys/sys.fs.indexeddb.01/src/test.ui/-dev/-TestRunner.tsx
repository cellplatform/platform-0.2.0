import { Dev, t } from '../../test.ui';

type T = { spinning?: boolean; results?: t.TestSuiteRunResponse[] };
const initial: T = {};

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        const { results, spinning } = e.state;
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

    dev.bdd((bdd) =>
      bdd
        .localstore('dev:sys.fs.indexeddb')
        .modules(async () => (await import('./-TestRunner.TESTS.mjs')).TESTS.all)
        .onChanged((e) => e.change((d) => (d.results = e.results))),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'sys.fs.indexeddb'} data={e.state} expand={1} />);
  });
});
