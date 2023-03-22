import { Dev, t, Time, WebRtc } from '.';

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
            scroll={true}
            padding={10}
            style={{ Absolute: 0 }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

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

      dev.title('Integration Tests');

      tests.push(
        ...[
          await button(import('../WebRtc/-dev/-TEST.mjs')),
          await button(import('../WebRtc/-dev/-TEST.conn.data.mjs')),
          await button(import('../WebRtc/-dev/-TEST.conn.media.mjs')),
        ],
      );

      dev.hr(-1, 10);

      tests.push(
        ...[
          await button(import('../WebRtc.Controller/-dev/-TEST.controller.mjs')),
          await button(import('../WebRtc.Controller/-dev/-TEST.mutate.mjs')),
          await button(import('../ui/ui.PeerCard/-dev/Schema.TEST.mjs')),
        ],
      );

      dev.hr(-1, 10);

      tests.push(
        ...[
          await button(import('../WebRtc/-dev/-TEST.sync.mjs')),
          await button(import('../WebRtc.Media/-TEST.mjs')),
        ],
      );

      dev.hr(-1, 10);

      tests.push(...[await button(import('./-dev.mocks/-TEST.mjs'))]);

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
      dev.button('stop media stream', () => {
        const media = WebRtc.Media.singleton();
        media.events.stop(media.ref.camera);
        media.events.stop(media.ref.screen);
      });

      /**
       * Immediate invocation of tests.
       */
      // if (!_hasImmediate) Time.delay(100, () => invoke(all));
    });
  });
});
