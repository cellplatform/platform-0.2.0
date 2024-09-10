import { DEFAULTS, Info } from '.';
import { Dev, Immutable, Json, Pkg, rx, type t } from '../../test.ui';

type P = t.InfoProps;
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

  type F = t.InfoField | undefined;
  const setFields = (fields?: F[]) => State.props.change((d) => (d.fields = fields));

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

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
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<D>((e) => {
        const props = State.props.current;
        const debug = State.debug.current;
        Dev.Theme.background(ctx, props.theme, 1);
        return <Info {...props} style={{ margin: 10 }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.section('Fields', (dev) => {
      dev.row(() => {
        return (
          <Info.FieldSelector
            selected={State.props.current.fields}
            onClick={(e) => setFields(e.next<t.InfoField>(DEFAULTS.props.fields))}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props);
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.enabled;
        btn
          .label(() => `enabled`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'enabled')));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>(() => {
      const props = State.props.current;
      const debug = State.debug.current;
      const data = { props, debug };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
