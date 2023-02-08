import { Dev, t } from '../test.ui';

type T = {
  debug: { testrunner: { spinning?: boolean; data?: t.TestSuiteRunResponse } };
};
const initial: T = { debug: { testrunner: {} } };

export default Dev.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .size('fill')
      .render<T>((e) => {
        return <Dev.TestRunner.Results {...e.state.debug.testrunner} padding={10} scroll={true} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.section('Tests', (dev) => {
      const invoke = async (module: t.SpecImport) => {
        await dev.change((d) => (d.debug.testrunner.spinning = true));
        const spec = (await module).default;
        const results = await spec.run();
        await dev.change((d) => {
          d.debug.testrunner.data = results;
          d.debug.testrunner.spinning = false;
        });
      };

      dev.button('Automerge (library) tests', (e) => invoke(import('./Automerge.lib.SPEC.mjs')));

      // TEMP 🐷
      invoke(import('./Automerge.lib.SPEC.mjs'));
    });
  });
});
