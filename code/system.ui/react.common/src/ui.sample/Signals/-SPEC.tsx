import { css, Dev, type t } from '../../test.ui';
import { signal, effect } from './common';
import { Sample } from './Sample';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Signals';

/**
 * https://github.com/preactjs/signals
 * https://preactjs.com/guide/v10/signals/
 */
export default Dev.describe(name, (e) => {
  const counter = signal(0);

  e.it('state', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    effect(() => {
      console.log('counter', counter.value);
      dev.redraw();
    });
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <Sample counter={counter} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.button('increment', (e) => counter.value++);
      dev.button('decrement', (e) => counter.value--);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { counter: counter.value };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
