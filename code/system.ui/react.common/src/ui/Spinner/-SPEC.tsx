import { Dev, type t } from '../../test.ui';
import { Spinner } from '.';

type T = { el?: JSX.Element };
const initial: T = {};

export default Dev.describe('Spinner', (e) => {
  const puff = async (dev: t.DevTools<T>, props?: t.SpinnerPuffProps) => {
    return dev.change((d) => (d.el = <Spinner.Puff {...props} />));
  };

  const bar = async (dev: t.DevTools<T>, props?: t.SpinnerBarProps) => {
    return dev.change((d) => (d.el = <Spinner.Bar {...props} />));
  };

  const orbit = async (dev: t.DevTools<T>, props?: t.SpinnerOrbitProps) => {
    return dev.change((d) => (d.el = <Spinner.Orbit {...props} />));
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject.render<T>((e) => e.state.el);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    await puff(dev);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'Spinner'} data={e.state} expand={1} />);

    dev.section('Puff', (dev) => {
      dev.button('size: 16px', (e) => puff(dev, { size: 16 }));
      dev.button('size: 32px (default)', (e) => puff(dev, {}));
      dev.button('size: 48px', (e) => puff(dev, { size: 48 }));
    });

    dev.hr();

    dev.section('Bar', (dev) => {
      dev.button('width: 20px', (e) => bar(dev, { width: 20 }));
      dev.button('width: 30px', (e) => bar(dev, { width: 30 }));
      dev.button('width: 100px (default)', (e) => bar(dev, {}));
      dev.button('width: 256px', (e) => bar(dev, { width: 256 }));
    });

    dev.hr();

    dev.section('Orbit', (dev) => {
      dev.button('size: 16px', (e) => orbit(dev, { size: 16 }));
      dev.button('size: 32px (default)', (e) => orbit(dev, {}));
      dev.button('size: 48px', (e) => orbit(dev, { size: 48 }));
    });

    dev.hr();
  });
});
