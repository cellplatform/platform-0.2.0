import { Info } from '.';
import { Color, Dev, Immutable, Json, PeerUI, TestEdge, css, rx, type t } from '../../test.ui';

type P = t.InfoProps;
type D = {
  data: {
    sharedLens?: boolean;
    sharedArray?: boolean;
    sharedDotMeta?: boolean;
    sharedObjectVisible?: boolean;
  };
};

/**
 * Spec
 */
const DEFAULTS = Info.DEFAULTS;
const name = DEFAULTS.displayName;

export default Dev.describe(name, async (e) => {
  const self = await TestEdge.create('Left');
  const remote = await TestEdge.create('Right');
  const peer = {
    self: self.network.peer,
    remote: remote.network.peer,
  } as const;

  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });

  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(
      Json.parse<D>(local.debug, {
        data: { sharedLens: false, sharedArray: false, sharedDotMeta: true },
      }),
    ),
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
      .size([320, null])
      .display('grid')
      .render<D>(() => {
        const props = State.props.current;
        const debug = State.debug.current;

        Dev.Theme.background(ctx, props.theme, 1);

        const shared: t.InfoShared = {
          object: {
            visible: debug.data.sharedObjectVisible,
            lens: debug.data.sharedLens ? ['sys', 'peers'] : undefined,
            dotMeta: debug.data.sharedDotMeta,
          },
        };

        const data: t.InfoData = {
          shared: !debug.data.sharedArray
            ? shared
            : [
                { ...shared, label: 'Shared One', object: { ...shared.object, name: 'Foo' } },
                { ...shared, label: 'Shared Two', object: { ...shared.object, name: 'Bar' } },
              ],
        };

        return (
          <Info
            {...props}
            style={{ margin: 10, minHeight: 300 }}
            data={data}
            network={self.network}
            fields={props.fields}
            onVisibleToggle={(e) => console.info('⚡️ onVisibleToggle', e)}
            onDocToggleClick={(e) => console.info('⚡️ onDocToggleClick', e)}
            onBeforeObjectRender={(mutate, ctx) => {
              mutate['foo'] = 123; // Sample render mutation (safe 🐷).
            }}
          />
        );
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={peer.self} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.section('Fields', (dev) => {
      dev.row(() => {
        const props = State.props.current;
        return (
          <Info.FieldSelector
            selected={props.fields}
            onClick={(e) => setFields(e.next<t.InfoField>(DEFAULTS.props.fields))}
          />
        );
      });

      dev.title('Common States');

      const config = (label: string | [string, string], fields: t.InfoField[]) => {
        dev.button(label, (e) => setFields(fields));
      };

      dev.button('(prepend): Visible', (e) => {
        const fields = State.props.current.fields ?? [];
        if (!fields.includes('Visible')) setFields(['Visible', ...fields]);
      });
      dev.hr(-1, 5);
      config('all', DEFAULTS.fields.all);
      config('info → PeerRepoList', ['Repo', 'Peer', 'Network.Transfer', 'Network.Shared']);

      // config('Repo / Doc', ['Repo', 'Doc', 'Doc.URI']);
      // config('Repo / Doc / Object', ['Repo', 'Doc', 'Doc.URI', 'Doc.Object']);
      // config('Repo / Doc / History + List', [
      //   'Repo',
      //   'Doc',
      //   'Doc.URI',
      //   'Doc.History',
      //   'Doc.History.Genesis',
      //   'Doc.History.List',
      //   'Doc.History.List.Detail',
      //   'Doc.History.List.NavPaging',
      // ]);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props);

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

    dev.section('Data', (dev) => {
      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.data.sharedLens;
        btn
          .label(() => `shared.lens`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedLens')));
      });
      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.data.sharedDotMeta;
        btn
          .label(() => `shared.dotMeta`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedDotMeta')));
      });
      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.data.sharedArray;
        btn
          .label(() => `shared ← [array]`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedArray')));
      });
      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.data.sharedObjectVisible;
        btn
          .label(() => `shared ← (object visible)`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedObjectVisible')));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', () => dev.redraw());
      dev.hr(-1, 5);
      dev.button(['connect network', '⚡️'], (e) => peer.self.connect.data(peer.remote.id));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<D>(() => {
        const props = State.props.current;
        const data = { props };

        const styles = {
          base: css({}),
          obj: css({ margin: 8 }),
          conn: css({ borderTop: `solid 1px ${Color.alpha(Color.DARK, 0.1)}` }),
        };
        return (
          <div {...styles.base}>
            <Dev.Object name={name} data={data} expand={1} style={styles.obj} fontSize={11} />
            <PeerUI.Connector peer={peer.remote} style={styles.conn} />
          </div>
        );
      });
  });
});
