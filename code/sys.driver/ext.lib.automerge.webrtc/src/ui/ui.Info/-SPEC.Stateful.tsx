import { Info } from '.';
import { Dev, Immutable, Json, TestEdge, rx, type t } from '../../test.ui';
import { SpecFooter, SpecHeader } from './-SPEC.common';

type P = t.InfoStatefulProps;
type D = { render?: boolean };

/**
 * Spec
 */
const DEFAULTS = Info.DEFAULTS;
const name = DEFAULTS.Stateful.displayName;

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
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { render: true })),
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

        return (
          <Info.Stateful
            {...props}
            style={{ margin: 10, minHeight: 300 }}
            network={self.network}
            fields={props.fields}
            onVisibleToggle={(e) => console.info('⚡️ onVisibleToggle', e)}
            onDocToggleClick={(e) => console.info('⚡️ onDocToggleClick', e)}
            onBeforeObjectRender={(mutate, ctx) => {
              mutate['foo'] = 123; // Sample render mutation (safe 🐷).
            }}
            onReady={(e) => {
              console.info('⚡️ Info.Stateful.onReady', e);
              e.dispose$.subscribe(() => console.info('⚡️ Info.Stateful.onReady → 💥(dispose)'));
            }}
          />
        );
      });
  });

  e.it('ui:header', (e) => {
    const dev = Dev.tools<D>(e);
    SpecHeader.define(dev, peer.self);
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

    dev.section('Debug', (dev) => {
      dev.button('redraw', () => dev.redraw());
      dev.hr(-1, 5);
      dev.button(['connect network', '⚡️'], (e) => peer.self.connect.data(peer.remote.id));
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<D>(e);
    SpecFooter.define(dev, name, peer.remote, State.props);
  });
});
