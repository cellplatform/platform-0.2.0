import { Wasmer, init as initWasm } from '@wasmer/sdk';
import { Dev, Pkg, type t } from '../../test.ui';

type T = {
  theme?: t.CommonTheme;
  running?: boolean;
  output?: { stderr?: string; stdout?: string };
};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: 'Dark' });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    await initWasm();

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.theme = local.theme;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        Dev.Theme.background(ctx, e.state.theme, 1);
        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    link.title('Reference');
    link.button('wasmer.io', 'https://wasmer.io/');
    link.button('docs', 'https://docs.wasmer.io/runtime/get-started');

    dev.hr(5, 20);

    dev.section('Samples', (dev) => {
      const running = async (value: boolean) => state.change((d) => (d.running = value));

      dev.button((btn) => {
        btn
          .label(`python/python`)
          .right((e) => '1+1')
          .spinner((e) => !!e.state.running)
          .onClick(async (e) => {
            await running(true);
            try {
              const python = await Wasmer.fromRegistry('python/python');
              const code = `print(1+1)`;
              const instance = await python.entrypoint?.run({ args: [`-c`, code] });
              const res = await instance?.wait();
              const stderr = res?.stderr;
              const stdout = res?.stdout;
              const output = { stdout, stderr };
              console.info(`output:`, output);
              state.change((d) => (d.output = output));
            } catch (error) {
              console.error('Failed to execute WASMER:', error);
            }
            await running(false);
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      Dev.Theme.switch(dev, ['theme'], (next) => (local.theme = next));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
