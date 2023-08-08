import { Dev, type t } from '../../test.ui';
import { Empty } from '.';

const DEFAULTS = Empty.DEFAULTS;

type T = { props: t.EmptyProps };
const initial: T = { props: {} };
const name = 'Empty';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.message = DEFAULTS.message;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Empty {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.italic);
        btn
          .label((e) => `italic`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'italic')));
      });

      dev.hr(-1, 10);

      dev.title('Message');
      const messageButton = (text: string) => {
        dev.button((btn) => {
          btn
            .label(`"${text}"`)
            .right((e) => e.state.props.message === text && `←`)
            .onClick((e) => e.change((d) => (d.props.message = text)));
        });
      };

      Object.values(DEFAULTS.messages).forEach(messageButton);
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
