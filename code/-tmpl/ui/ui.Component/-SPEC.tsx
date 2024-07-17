import { DEFAULTS, Root } from '.';
import { css, Color, rx, Dev, Immutable, Pkg } from '../../test.ui';
import { type t } from './common';

type P = t.RootProps;
type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = { props?: t.JsonString; debug?: t.JsonString };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const state = {
    props: Immutable.clonerRef<P>(local.props ? JSON.parse(local.props) : {}),
    debug: Immutable.clonerRef<T>(local.debug ? JSON.parse(local.debug) : {}),
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const props$ = state.props.events().changed$;
    const debug$ = state.debug.events().changed$;

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = JSON.stringify(state.props.current);
        local.debug = JSON.stringify(state.debug.current);
      });

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => dev.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const props = state.props.current;
        Dev.Theme.background(dev, props.theme, 1);
        return <Root {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, state.props);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { props: state.props.current };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
