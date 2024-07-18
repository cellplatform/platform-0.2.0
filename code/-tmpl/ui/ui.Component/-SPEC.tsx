import { DEFAULTS, Root } from '.';
import { css, Color, rx, Dev, Immutable, Json, Pkg } from '../../test.ui';
import { type t } from './common';

type P = t.RootProps;
type D = {};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = { props?: t.JsonString; debug?: t.JsonString };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const state = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, {})),
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);

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
      .render<D>((e) => {
        const props = state.props.current;
        Dev.Theme.background(dev, props.theme, 1);
        return <Root {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, state.props, 1);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const data = { props: state.props.current };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
