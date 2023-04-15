import { Dev, Pkg } from '../../../test.ui';
import { PropList } from '../../../ui/PropList';
import suite1 from './-TEST.sample-1.mjs';
import suite2 from './-TEST.sample-2.mjs';

import type { TestCtx, ResultsProps } from './-types.mjs';

type T = { props: ResultsProps; ctx: TestCtx };
const initial: T = {
  props: { spinning: false, scroll: true },
  ctx: { fail: false },
};

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
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

    dev.title('PropList');

    dev.row((e) => {
      type TField = 'Module' | 'Module.Version' | 'Module.Tests';
      const fields: TField[] = ['Module', 'Module.Version', 'Module.Tests'];

      const items = PropList.builder<TField>()
        .field('Module', { label: 'Module', value: Pkg.name })
        .field('Module.Version', { label: 'Version', value: Pkg.version })
        .field('Module.Tests', () =>
          Dev.TestRunner.PropList.item(async () => {
            const m1 = await import('./-TEST.sample-1.mjs');
            const m2 = await import('./-TEST.sample-2.mjs');
            const root = await Dev.bundle([m1.default, m2.default]);
            const ctx = state.current.ctx;
            return { root, ctx };
          }),
        )
        .items(fields);

      return <PropList items={items} margin={[30, 35, 20, 35]} defaults={{ clipboard: false }} />;
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.render((e) => {
      return <Dev.TestRunner.Compact />;
    });
  });
});
