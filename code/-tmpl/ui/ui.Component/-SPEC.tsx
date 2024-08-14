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
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, {})),
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);

    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;
    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
      });
    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<D>((e) => {
        const props = State.props.current;
        Dev.Theme.background(dev, props.theme, 1);
        return <Root {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props, 1);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const props = State.props.current;
      const data = { props };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
