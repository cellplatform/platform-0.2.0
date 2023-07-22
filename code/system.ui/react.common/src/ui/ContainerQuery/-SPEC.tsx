import { Dev, type t } from '../../test.ui';
import { ContainerQuery } from '.';

type T = {
  props: t.ContainerQueryProps;
  debug: { render?: boolean };
};
const initial: T = {
  props: { displayName: 'foobar' },
  debug: { render: true },
};

export default Dev.describe('ContainerQuery', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        if (!debug.render) return <div />;
        return <ContainerQuery {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.render);
        btn
          .label((e) => `render`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'render')));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'ContainerQuery'} data={data} expand={1} />;
    });
  });
});
