import { Dev, t, Time } from '../test.ui';

type T = {
  testrunner: { spinning?: boolean; results?: t.TestSuiteRunResponse };
};
const initial: T = {
  testrunner: {},
};

export default Dev.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        const { spinning, results } = e.state.testrunner;
        return (
          <Dev.TestRunner.Results
            data={results}
            spinning={spinning}
            padding={10}
            scroll={true}
            style={{ Absolute: 0 }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { TestResults: e.state.testrunner.results };
      return <Dev.Object name={'spec'} data={data} expand={1} />;
    });

    dev.section(async (dev) => {
      const invoke = async (spec: t.TestSuiteModel) => {
        await dev.change((d) => (d.testrunner.spinning = true));
        const results = await spec.run();
        await dev.change((d) => {
          d.testrunner.results = results;
          d.testrunner.spinning = false;
        });
      };

      let _hasImmediate = false;
      const tests: t.TestSuiteModel[] = [];
      const button = async (input: t.SpecImport, immediate?: boolean) => {
        const module = await input;
        const spec = await (module.default as t.TestSuiteModel).init();
        dev.button((btn) =>
          btn
            .label(spec.description)
            .right(() => (immediate ? '← immediate' : ''))
            .onClick(() => invoke(spec)),
        );
        if (immediate) invoke(spec);
        if (immediate) _hasImmediate = true;
        return spec;
      };

      dev.title('sys.crdt');

      tests.push(
        ...[
          await button(import('../crdt.DocRef/-dev/-TEST.mjs')),
          await button(import('../crdt.DocFile/-TEST.mjs')),
          await button(import('../crdt.DocSync/-TEST.DocSync.mjs')),
          await button(import('../crdt.DocSync/-TEST.PeerSyncer.mjs')),
          await button(import('../crdt.helpers/-TEST.mjs'), true),
        ],
      );

      dev.hr(-1, 10);

      dev.title('Driver (Automerge)');
      tests.push(
        ...[
          await button(import('../driver.Automerge/-dev/TEST.basic.mjs')),
          await button(import('../driver.Automerge/-dev/TEST.api.mjs')),
          await button(import('../driver.Automerge/-dev/TEST.initialState.mjs')),
          await button(import('../driver.Automerge/-dev/TEST.filesystem.mjs')),
          await button(import('../driver.Automerge/-dev/TEST.sync.mjs')),
        ],
      );

      dev.hr(5, 20);

      const all = Dev.describe('All Test Suites');
      all.merge(...tests);

      dev.button((btn) =>
        btn
          .label('run all')
          .right('🌳')
          .onClick((e) => invoke(all)),
      );
      dev.hr(-1, 5);
      dev.button('clear', (e) =>
        e.change((d) => {
          d.testrunner.results = undefined;
          d.testrunner.spinning = false;
        }),
      );

      /**
       * Immediate invocation of tests.
       */
      if (!_hasImmediate) Time.delay(100, () => invoke(all));
    });
  });
});
