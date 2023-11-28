import { Dev, Icons, TestDb } from '.';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'TestDb';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <Icons.Database size={80} style={{ margin: 20 }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.button('delete all', () => TestDb.deleteDatabases());
    dev.hr(-1, 5);
    dev.button('delete: unit test', () => TestDb.Unit.deleteDatabase);
    dev.button('delete: spec sample', () => TestDb.Spec.deleteDatabase);
  });
});
