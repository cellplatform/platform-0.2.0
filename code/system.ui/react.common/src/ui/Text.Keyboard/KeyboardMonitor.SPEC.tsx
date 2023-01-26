import { Dev, t } from '../../test.ui';
import { DevSample } from './-dev/DEV.Sample';
import { Keyboard } from '.';

type T = { keyboard: t.KeyboardState };
const initial: T = {
  keyboard: Keyboard.Monitor.state,
};

export default Dev.describe('KeyboardMonitor', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    Keyboard.Monitor.subscribe((current) => state.change((d) => (d.keyboard = current)));

    ctx.subject
      .display('grid')
      .size(540, 300)
      .render<T>((e) => {
        return <DevSample state={e.state.keyboard} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => (
        <Dev.Object name={'KeyboardMonitor.spec'} data={e.state.keyboard} expand={1} />
      ));

    dev.row((e) => {
      const event = e.state.keyboard.last;
      return <Keyboard.ui.EventProps event={event} style={{ MarginX: 15 }} />;
    });
  });
});
