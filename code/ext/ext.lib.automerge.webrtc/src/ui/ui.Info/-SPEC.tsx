import { Info } from '.';
import { COLORS, Color, Dev, PeerUI, Pkg, TestEdge, WebStore, css, type t } from '../../test.ui';

type P = t.InfoProps;
type D = { dataUseLens?: boolean; dataVisible?: boolean; dataJsonVisible?: boolean };
type T = D & { props: P };
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, async (e) => {
  const self = await TestEdge.create('Left');
  const remote = await TestEdge.create('Right');

  const peer = {
    self: self.network.peer,
    remote: remote.network.peer,
  } as const;

  const store = WebStore.init({ network: [] });
  const index = await WebStore.index(store);

  type LocalStore = D & Pick<P, 'fields' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    fields: DEFAULTS.fields.default,
    theme: undefined,
    dataUseLens: false,
    dataJsonVisible: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.fields = local.fields;
      d.props.margin = 10;
      d.dataUseLens = local.dataUseLens;
      d.dataJsonVisible = local.dataJsonVisible;
    });

    ctx.debug.width(330);
    ctx.subject
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        const { props, dataVisible, dataJsonVisible, dataUseLens } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);

        const visible = dataVisible ?? true;
        const data: t.InfoData = {
          network: self.network,
          repo: { store, index },
          visible: {
            value: visible,
            onToggle: (e) => state.change((d) => (d.dataVisible = e.next)),
          },
          shared: {
            lens: dataUseLens ? ['sys', 'peers'] : undefined,
            object: {
              visible: dataJsonVisible,
              beforeRender(mutate: any) {
                mutate['foo'] = 123; // Sample render mutation 🐷
              },
            },
            onIconClick(e) {
              console.info('⚡️ shared.onIconClick', e);
              state.change((d) => (local.dataJsonVisible = Dev.toggle(d, 'dataJsonVisible')));
            },
          },
        };

        return (
          <Info
            //
            {...props}
            data={data}
            fields={visible ? props.fields : ['Visible']}
          />
        );
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={peer.self} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      const setFields = (fields?: (t.InfoField | undefined)[]) => {
        dev.change((d) => (d.props.fields = fields));
        local.fields = fields?.length === 0 ? undefined : fields;
      };

      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(ev) => {
              const fields =
                ev.action === 'Reset:Default'
                  ? DEFAULTS.fields.default
                  : (ev.next as t.InfoField[]);
              setFields(fields);
            }}
          />
        );
      });

      dev.title('Common States');
      const config = (label: string, fields?: t.InfoField[]) => {
        dev.button(label, (e) => setFields(fields));
      };

      config('all', DEFAULTS.fields.all);
      config('info → PeerRepoList', [
        'Repo',
        'Peer',
        'Network.Transfer',
        'Network.Shared',
        // 'Network.Shared.Json',
      ]);
      dev.hr(-1, 5);
      dev.button('prepend: Visible', (e) => {
        const fields = e.state.current.props.fields ?? [];
        if (!fields.includes('Visible')) setFields(['Visible', ...fields]);
      });
    });

    dev.hr(5, 20);

    dev.section('Data', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.dataUseLens;
        btn
          .label((e) => `use shared.lens`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.dataUseLens = Dev.toggle(d, 'dataUseLens'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
      dev.hr(-1, 5);
      dev.button(['connect network', '⚡️'], (e) => peer.self.connect.data(peer.remote.id));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        const data = e.state;
        const styles = {
          base: css({}),
          obj: css({ margin: 8 }),
          conn: css({ borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}` }),
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
