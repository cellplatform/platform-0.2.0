import { DEFAULTS, PageStack } from '.';
import { Dev, Immutable, Json, Pkg, rx } from '../../test.ui';
import { type t } from './common';

type P = t.PageStackProps;
type D = {};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });

  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, {})),
  } as const;

  const Props = {
    get current(): P {
      const props = State.props.current;
      return props;
    },
  };

  e.it('ui:init', (e) => {
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
      .subscribe(() => dev.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x', 100)
      .display('grid')
      .render<D>((e) => {
        const props = Props.current;
        Dev.Theme.background(dev, props.theme, 1);
        return <PageStack {...props} onClick={(e) => console.info(`⚡️ onClick:`, e)} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props, 1);
      dev.hr(-1, 5);

      const total = (total: number) => {
        let label = `total: ${total}`;
        if (total === DEFAULTS.props.total) label = `${label} (default)`;

        dev.button((btn) => {
          const current = () => State.props.current.total;
          btn
            .label(label)
            .right(() => (current() === total ? '←' : ''))
            .onClick(() => State.props.change((d) => (d.total = total)));
        });
      };

      total(0);
      total(3);
      total(DEFAULTS.props.total);
      total(10);
    });

    dev.hr(5, 20);

    dev.section('Current', (dev) => {
      const increment = (by: number) => {
        State.props.change((d) => (d.current = (d.current ?? 0) + by));
      };
      dev.button(['increment', '↑'], (e) => increment(+1));
      dev.button(['decrement', '↓'], (e) => increment(-1));

      dev.hr(-1, 5);
      dev.button('reset', (e) => {
        State.props.change((d) => (d.current = DEFAULTS.props.current));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const data = { props: Props.current };
      return <Dev.Object name={name} data={data} expand={2} fontSize={11} />;
    });
  });
});
