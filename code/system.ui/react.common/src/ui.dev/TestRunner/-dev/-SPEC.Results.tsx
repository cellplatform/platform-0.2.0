import { Dev, Pkg, t, Time } from '../../../test.ui';

import suite1 from './-TEST.sample-1.mjs';
import suite2 from './-TEST.sample-2.mjs';

import type { TestResultsProps } from '../Results';
import type { TestCtx } from './-types.mjs';

type T = {
  ctx: TestCtx;
  props: TestResultsProps;
  debug: { card: boolean };
};
const initial: T = {
  ctx: { fail: false },
  props: { spinning: false, scroll: true },
  debug: {
    card: true,
  },
};

export default Dev.describe('TestRunner', (e) => {
  type LocalStore = { card: boolean; selected: string[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner.Results');
  const local = localstore.object({
    card: initial.debug.card,
    selected: [],
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.card = local.card;
    });

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return <Dev.TestRunner.Results {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Runner', (dev) => {
      dev.button('clear', (e) => e.change((d) => (d.props.data = undefined)));

      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.fail = ${e.state.ctx.fail}`)
          .value((e) => e.state.ctx.fail)
          .onClick((e) => e.change((d) => Dev.toggle(d.ctx, 'fail'))),
      );

      dev.hr(-1, 5);

      dev.button('run: sample', async (e) => {
        const ctx = e.state.current.ctx;
        const results = await suite1.run({ ctx });
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

    dev.hr(5, 20);
  });

  e.it('ui:debug.PropList', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('TestRunner.PropList', async (dev) => {
      const get: t.GetTestSuite = async () => {
        const m1 = await import('./-TEST.sample-1.mjs');
        const m2 = await import('./-TEST.sample-2.mjs');

        const root = await Dev.bundle([m1.default, m2.default]);
        const ctx = state.current.ctx;
        await Time.wait(800); // Sample delay.
        return { root, ctx };
      };

      const controller = await Dev.TestRunner.PropList.controller({
        pkg: Pkg,
        run: { infoUrl: location.href, get },
        specs: {
          all: [import('./-TEST.sample-1.mjs'), import('./-TEST.sample-2.mjs')],
          selected: local.selected,
          onChange: (e) => (local.selected = controller.selected),
        },
      });

      controller.$.subscribe(() => dev.redraw());

      dev.row(async (e) => {
        const { debug } = e.state;

        return (
          <Dev.TestRunner.PropList
            fields={['Tests.Run', 'Tests.Selector']}
            data={controller.current}
            card={debug.card}
            margin={[20, 35, 0, 35]}
          />
        );
      });
    });

    dev.hr(-1, [30, 10]);

    dev.boolean((btn) =>
      btn
        .label((e) => `card`)
        .value((e) => e.state.debug.card)
        .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.debug, 'card')))),
    );
  });
});
