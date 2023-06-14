import { Dev } from '../../../test.ui';
import { Sample } from './-Sample';

type T = { isEnabled: boolean };
const initial: T = { isEnabled: true };

export default Dev.describe('useDragTarget', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Sample isEnabled={e.state.isEnabled} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.boolean((btn) =>
      btn
        .label((e) => `isEnabled`)
        .value((e) => Boolean(e.state.isEnabled))
        .onClick((e) => e.change((d) => Dev.toggle(d, 'isEnabled'))),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'useDragTarget'} data={data} expand={1} />;
    });
  });
});
