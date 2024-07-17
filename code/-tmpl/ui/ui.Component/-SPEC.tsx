import { DEFAULTS, Root } from '.';
import { css, Color, rx, Dev, Immutable, Pkg } from '../../test.ui';
import { type t } from './common';

type P = t.RootProps;
type T = { debug: {} };
const initial: T = { debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & { props?: t.JsonString };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined });

  const propState = Immutable.clonerRef<P>(local.props ? JSON.parse(local.props) : {});

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const props$ = propState.events().changed$;
    props$.pipe(rx.debounceTime(100)).subscribe((e) => {
      dev.redraw();
      local.props = JSON.stringify(propState.current);
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        const props = propState.current;
        return <Root {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, propState);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { props: propState.current };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
