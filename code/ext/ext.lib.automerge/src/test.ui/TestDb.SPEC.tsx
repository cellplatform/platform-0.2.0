import { Dev, Icons, TestDb } from '.';

type T = { reload?: boolean };
const initial: T = {};

/**
 * Spec
 */
const name = 'TestDb';
export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    const resetReloadClose = () => state.change((d) => (d.reload = false));

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill', 150)
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.UI.Reload onCloseClick={resetReloadClose} />;
        } else {
          return <Icons.Database size={80} style={{ placeSelf: 'center' }} />;
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Delete', (dev) => {
      const deleteButton = (label: string, fn: () => Promise<any>) => {
        dev.button([`delete db: ${label}`, '💥'], async (e) => {
          await e.change((d) => (d.reload = true));
          await fn();
        });
      };

      deleteButton('all', TestDb.deleteDatabases);
      dev.hr(2, 5);
      deleteButton(TestDb.Unit.name, TestDb.Unit.deleteDatabase);
      deleteButton(TestDb.Spec.name, TestDb.Spec.deleteDatabase);
    });
  });
});
