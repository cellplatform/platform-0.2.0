import { Dev, type t, rx, TestFile } from '../../../test.ui';
import { Layout } from '..';
// import { DATA } from './-sample.data.mjs';

type T = { props: t.LayoutStatefulProps };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = 'Layout (Stateful)';

export default Dev.describe(name, async (e) => {
  const { dispose, dispose$ } = rx.disposable();

  /**
   * (CRDT) Filesystem
   */
  const { dir, fs, doc, file } = await TestFile.init({ dispose$ });

  /**
   * Initialize
   */
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.slugs = doc.current.slugs;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Layout.Stateful {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.title(['Stateful', '(Controller)']);
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
