import { Dev, type t } from '../../test.ui';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
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
        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    async function loadMyModule() {
      try {
        // Assuming the module is located in 'myModuleDirectory/index.ts'
        // Replace './myModuleDirectory' with the actual path relative to this file
        const myModule = await import('../../ext.Foo');

        console.log('myModule', myModule);
        myModule.Foo.run();

        // Use the imported module
        // For example, if 'myModule' exports a function named 'myFunction', you can call it as:
        // myModule.myFunction();
      } catch (error) {
        console.error('Failed to load the module:', error);
      }
    }

    dev.button('load', (e) => loadMyModule());
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
