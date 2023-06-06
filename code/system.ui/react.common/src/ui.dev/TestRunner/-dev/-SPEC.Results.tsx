import { Dev, type TestCtx } from './-common.mjs';
import suite1 from './-TEST.sample-1.mjs';
import suite2 from './-TEST.sample-2.mjs';

import { type TestResultsProps } from '../Test.Results';

type T = {
  ctx: TestCtx;
  props: TestResultsProps;
  debug: { noop: boolean };
};
const initial: T = {
  ctx: { fail: false, delay: 300 },
  props: { spinning: false, scroll: true },
  debug: { noop: false },
};

export default Dev.describe('TestRunner', (e) => {
  type LocalStore = TestCtx & T['debug'] & { selected: string[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner.Results');
  const local = localstore.object({
    selected: [],
    fail: initial.ctx.fail,
    delay: initial.ctx.delay,
    noop: initial.debug.noop,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.ctx.fail = local.fail;
      d.ctx.delay = local.delay;
      d.debug.noop = local.noop;
    });

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return <Dev.TestRunner.Results {...e.state.props} />;
      });
  });

  e.it('ui:debug.PropList', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <Dev.TestRunner.PropList.Controlled
          margin={[20, 35, 0, 30]}
          initial={{
            run: {
              ctx: () => state.current.ctx,
              list: [
                import('./-TEST.sample-1.mjs'),
                import('./-TEST.sample-2.mjs'),
                import('./-TEST.controller.mjs'),
              ],
            },
            specs: { selected: local.selected },
          }}
          onChanged={async (e) => {
            local.selected = e.selected;
            await state.change((d) => (d.props.data = e.results));
          }}
        />
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Runner', (dev) => {
      dev.button('clear', (e) => e.change((d) => (d.props.data = undefined)));

      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.fail = ${e.state.ctx.fail}`)
          .value((e) => e.state.ctx.fail)
          .onClick((e) => e.change((d) => (local.fail = Dev.toggle(d.ctx, 'fail')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `run({ noop: ${e.state.debug.noop} })`)
          .value((e) => e.state.debug.noop)
          .onClick((e) => e.change((d) => (local.noop = Dev.toggle(d.debug, 'noop')))),
      );

      dev.hr(-1, 5);

      dev.button('run: sample', async (e) => {
        const { ctx, debug } = e.state.current;
        const noop = debug.noop;
        const results = await suite1.run({ ctx, noop });
        await e.change((d) => (d.props.data = results));
      });

      dev.button((btn) =>
        btn
          .label('run: long, overflowing')
          .right('← scollable')
          .onClick(async (e) => {
            const ctx = e.state.current.ctx;
            const results = await suite2.run({ ctx });
            await e.change((d) => (d.props.data = results));
          }),
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('spinning')
          .value((e) => e.state.props.spinning)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'spinning'))),
      );

      dev.boolean((btn) =>
        btn
          .label('scroll')
          .value((e) => e.state.props.scroll)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'scroll'))),
      );
    });
  });
});
