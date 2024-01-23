import { css, Dev, type t, TestDb } from '../../test.ui';
import { MonacoEditor } from '../../ui/ui.MonacoEditor';

type T = { reload?: boolean };
const initial: T = {};

/**
 * Spec
 */
const name = 'Editor.Crdt.Lens';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    const resetReloadClose = () => state.change((d) => (d.reload = false));
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.DevReload onCloseClick={resetReloadClose} />;
        } else {
          return <MonacoEditor />;
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.button([`delete db: "${TestDb.Spec.name}"`, '💥'], async (e) => {
        await e.change((d) => (d.reload = true));
        await TestDb.Spec.deleteDatabase();
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
