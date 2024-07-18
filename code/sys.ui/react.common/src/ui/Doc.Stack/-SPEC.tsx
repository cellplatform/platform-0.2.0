import { DEFAULTS, DocStack } from '.';
import { COLORS, css, Dev, Immutable, Json, Pkg, rx, slug } from '../../test.ui';
import { type t } from './common';

type P = t.DocStackProps;
type D = { ids: string[]; start: t.Index };

const defaultDebug = (): D => {
  return {
    ids: Array.from({ length: 20 }).map(() => slug()),
    start: 0,
  };
};

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
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, defaultDebug)),
  } as const;

  const Props = {
    get current() {
      return {
        ...state.props.current,
        ids: Props.ids.current,
      };
    },
    ids: {
      get all() {
        return state.debug.current.ids;
      },
      get current() {
        const { ids, start } = state.debug.current;
        const { total = DEFAULTS.props.total } = state.props.current;
        return ids.slice(start, start + total);
      },
      get range() {
        const { start } = state.debug.current;
        const { total = DEFAULTS.props.total } = state.props.current;
        const end = start + total - 1;
        return { start, end, total } as const;
      },
      withinRange(index: t.Index) {
        const { start, end } = Props.ids.range;
        return !(index < start || index > end);
      },
    },
  } as const;

  e.it('ui:init', (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);

    const props$ = state.props.events().changed$;
    const debug$ = state.debug.events().changed$;

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(state.props.current);
        local.debug = Json.stringify(state.debug.current);
      });

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => dev.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x', 100)
      .display('grid')
      .render<D>((e) => {
        const debug = state.debug.current;
        const props = Props.current;
        Dev.Theme.background(dev, props.theme, 1);
        return <DocStack {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, state.props, 1);
    });

    dev.hr(5, 20);

    dev.section('Ids', (dev) => {
      dev.row((e) => {
        const ids = Props.ids.all;
        const styles = {
          base: css({
            lineHeight: 1.5,
            marginLeft: 30,
            marginBottom: 20,
            display: 'grid',
            gridTemplateColumns: `repeat(4, 1fr)`,
          }),
          id: css({ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, opacity: 0.1 }),
          current: css({ opacity: 1 }),
          first: css({ color: COLORS.MAGENTA }),
        };

        const elList = ids.map((id, i) => {
          const style = Props.ids.withinRange(i) ? styles.current : undefined;
          const isFirst = Props.ids.range.start === i;
          return (
            <div key={id} {...css(styles.id, style, isFirst && styles.first)}>
              {id}
            </div>
          );
        });

        return <div {...styles.base}>{elList}</div>;
      });

      const increment = (by: number) => {
        const { ids } = state.debug.current;
        state.debug.change((d) => {
          const next = d.start + by;
          d.start = Math.max(0, Math.min(ids.length - 1, next));
        });
      };

      dev.button('start:(next)', (e) => increment(1));
      dev.button('start:(prev)', (e) => increment(-1));

      dev.hr(-1, 5);
      dev.button('reset', (e) => {
        state.debug.change((d) => {
          const next = defaultDebug();
          d.start = next.start;
          d.ids = next.ids;
        });
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
      const data = {
        props: Props.current,
        debug: state.debug.current,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
