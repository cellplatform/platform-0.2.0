import { Dev, Pkg } from '../../../test.ui';
import { PropList } from '../../../ui/PropList';
import suite1 from './-TEST.sample-1.mjs';
import suite2 from './-TEST.sample-2.mjs';

import type { TestCtx, ResultsProps } from './-types.mjs';

type T = { props: ResultsProps };
const initial: T = { props: { spinning: false, scroll: true } };

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

    dev.section('Run', (dev) => {
      dev.button('pass', async (e) => {
        const ctx: TestCtx = { fail: false };
        const results = await suite1.run({ ctx });
        await e.change((d) => (d.props.data = results));
      });

      dev.button((btn) =>
        btn
          .label('pass (long, overflowing)')
          .right('← scollable')
          .onClick(async (e) => {
            const results = await suite2.run();
            await e.change((d) => (d.props.data = results));
          }),
      );

      dev.button('fail', async (e) => {
        const ctx: TestCtx = { fail: true };
        const results = await suite1.run({ ctx });
        await e.change((d) => (d.props.data = results));
      });

      dev.hr(-1, 5);
      dev.button('clear', (e) => e.change((d) => (d.props.data = undefined)));
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

    dev.title('PropList');
    dev.row((e) => {
      type TField = 'Module' | 'Module.Version' | 'Module.Tests';
      const fields: TField[] = ['Module', 'Module.Version', 'Module.Tests'];

      const items = PropList.builder<TField>()
        .field('Module', { label: 'Module', value: Pkg.name })
        .field('Module.Version', { label: 'Version', value: Pkg.version })
        .field('Module.Tests', () => [])
        .items(fields);

      return <PropList items={items} margin={[20, 35]} defaults={{ clipboard: false }} />;
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.render((e) => {
      return <Dev.TestRunner.Compact />;
    });
  });
});
