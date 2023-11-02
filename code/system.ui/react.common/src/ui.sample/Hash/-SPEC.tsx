import { Hash, css, Dev, type t } from '../../test.ui';
import { Drop } from './ui.Drop';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Hash';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(0);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Drop onDrop={(e) => console.info(`drop`, e)} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
  });
});
