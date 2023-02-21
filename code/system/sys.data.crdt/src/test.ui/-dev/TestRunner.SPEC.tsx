import { Dev, t } from '..';

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
      .size('fill')
      .render<T>((e) => {
        return (
          <Dev.TestRunner.Results
            {...e.state.debug.testrunner}
            padding={10}
            scroll={true}
            style={{ Absolute: 0 }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.section(async (dev) => {
      const invoke = async (spec: t.TestSuiteModel) => {
        await dev.change((d) => (d.debug.testrunner.spinning = true));
        const results = await spec.run();
        await dev.change((d) => {
          d.debug.testrunner.data = results;
          d.debug.testrunner.spinning = false;
        });
      };

      const tests: t.TestSuiteModel[] = [];
      const button = async (input: t.SpecImport) => {
        const module = await input;
        const spec = await (module.default as t.TestSuiteModel).init();
        dev.button(spec.description, (e) => invoke(spec));
        return spec;
      };

      dev.button('Run All', async (e) => await invoke(all));

      dev.hr();

      dev.title('sys.crdt');

      tests.push(
        ...[
          await button(import('../../crdt.Sync/PeerSyncer.TEST.mjs')),
          await button(import('../../crdt.Doc/Crdt.DocRef.TEST.mjs')),
        ],
      );

      dev.hr();

      dev.title('Driver');
      tests.push(
        ...[
          await button(import('../../driver.Automerge/-dev/TEST.basic.mjs')),
          await button(import('../../driver.Automerge/-dev/TEST.api.mjs')),
          await button(import('../../driver.Automerge/-dev/TEST.filesystem.mjs')),
          await button(import('../../driver.Automerge/-dev/TEST.sync.mjs')),
        ],
      );

      dev.hr();

      const all = Dev.describe('All Suites');
      all.merge(...tests);
    });
  });
});
