import { Dev, Time, WebRtc, type t } from '.';

type T = { testrunner: { spinning?: boolean; results?: t.TestSuiteRunResponse[] } };
const initial: T = { testrunner: {} };

export default Dev.describe('Root', (e) => {
  type LocalStore = { selected: string[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.testrunner');
  const local = localstore.object({ selected: [] });

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
            style={{ Absolute: 0 }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <Dev.TestRunner.PropList.Controlled
          margin={[20, 10, 0, 0]}
          initial={{
            run: {
              label: 'Integration Tests',
              all: [
                import('../WebRtc/-dev/-TEST.mjs'),
                import('../WebRtc/-dev/-TEST.conn.data.mjs'),
                import('../WebRtc/-dev/-TEST.conn.media.mjs'),
                //
                import('../WebRtc.Controller/-dev/-TEST.controller.mjs'),
                import('../WebRtc.Controller/-dev/-TEST.controller.3-way.mjs'),
                import('../WebRtc.Controller/-dev/-TEST.controller.fails.mjs'),
                import('../WebRtc.State/-dev/-TEST.mjs'),
                import('../WebRtc.State/-dev/-TEST.mutate.mjs'),
                import('../sys.net.schema/-TEST.mjs'),
                //
                import('../WebRtc/-dev/-TEST.sync.mjs'),
                import('../WebRtc.Media/-TEST.mjs'),
                //
                import('./-dev.mocks/-TEST.mjs'),
              ],
            },
            specs: { selected: local.selected },
          }}
          onChanged={async (e) => {
            local.selected = e.selected;
            await state.change((d) => (d.testrunner.results = e.results));
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section(async (dev) => {
      const invoke = async (spec: t.TestSuiteModel) => {
        await dev.change((d) => (d.testrunner.spinning = true));
        const results = await spec.run();
        await dev.change((d) => {
          // d.testrunner.results = results;
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
          await button(import('../WebRtc.Controller/-dev/-TEST.controller.3-way.mjs')),
          await button(import('../WebRtc.Controller/-dev/-TEST.controller.fails.mjs')),
          await button(import('../WebRtc.State/-dev/-TEST.mjs'), true),
          await button(import('../WebRtc.State/-dev/-TEST.mutate.mjs')),
          await button(import('../sys.net.schema/-TEST.mjs')),
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
          .label((e) => (e.state.testrunner.spinning ? 'running...' : 'run'))
          .right('🌳')
          .spinner((e) => Boolean(e.state.testrunner.spinning))
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

      dev.button('copy schema bytes', (e) => {
        const schema = WebRtc.NetworkSchema.genesis().schema;
        console.info('Network Schema:', schema.toString());
        navigator.clipboard.writeText(schema.toString());

        e.right('← copied');
        Time.delay(1500, () => e.right(''));
      });

      /**
       * Immediate invocation of tests.
       */
      // if (!_hasImmediate) Time.delay(100, () => invoke(all));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'suite'} data={data} expand={1} />;
    });
  });
});
