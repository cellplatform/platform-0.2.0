import { Dev, t } from '../../test.ui';
import { Spinner } from '.';

type T = { el?: JSX.Element };
const initial: T = {};

export default Dev.describe('Spinner', (e) => {
  const puff = async (dev: t.DevTools<T>, props?: t.SpinnerPuffProps) => {
    return dev.change((d) => (d.el = <Spinner.Puff {...props} />));
  };

  const barLoader = async (dev: t.DevTools<T>, props?: t.SpinnerBarLoaderProps) => {
    return dev.change((d) => (d.el = <Spinner.Bar {...props} />));
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject.render<T>((e) => e.state.el);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    await puff(dev);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec.Spinner'} data={e.state} expand={1} />);

    dev.section('Puff', (dev) => {
      dev.button('size: 16px', (e) => puff(dev, { size: 16 }));
      dev.button('size: 32px (default)', (e) => puff(dev, {}));
      dev.button('size: 48px', (e) => puff(dev, { size: 48 }));
    });
    dev.hr();

    dev.section('BarLoader', (dev) => {
      dev.button('width: 30px', (e) => barLoader(dev, { width: 30 }));
      dev.button('width: 100px (default)', (e) => barLoader(dev, {}));
      dev.button('width: 256px', (e) => barLoader(dev, { width: 256 }));
    });
  });
});
