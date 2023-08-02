import { Dev, type t, useMouse, css } from '../../../test.ui';

type T = { props: t.UseMouseProps };
const initial: T = {
  props: {},
};
const name = 'useMouse';

export default Dev.describe(name, (e) => {
  function Sample(props: t.UseMouseProps) {
    const mouse = useMouse(props);

    const styles = {
      base: css({ padding: 5 }),
    };

    const data = {
      is: mouse.is,
    };

    return (
      <div {...styles.base} {...mouse.handlers}>
        <Dev.Object name={'useMouse'} data={data} expand={2} />
      </div>
    );
  }

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <Sample />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => d.props.enabled));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
