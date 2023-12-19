import { Info } from '.';
import { COLORS, Color, Dev, Peer, PeerUI, WebStore, css, type t } from '../../test.ui';
import { createEdge } from '../ui.Sample.02';

type T = { props: t.InfoProps };
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? '⚠️';
export default Dev.describe(name, async (e) => {
  const self = await createEdge('Left');
  const remote = await createEdge('Right');

  const peer = {
    self: self.network.peer,
    remote: remote.network.peer,
  } as const;

  const store = WebStore.init({ network: [] });
  const index = await WebStore.index(store);

  type LocalStore = { selectedFields?: t.InfoField[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.webrtc.Info');
  const local = localstore.object({
    selectedFields: DEFAULTS.fields.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.fields = local.selectedFields;
      d.props.margin = 10;
    });

    const monitor = (network: t.WebrtcStore) => {
      network.peer.events().$.subscribe(() => ctx.redraw());
      network.$.subscribe(() => ctx.redraw());
    };
    monitor(self.network);
    monitor(remote.network);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        return <Info {...e.state.props} data={{ network: self.network, repo: { store, index } }} />;
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
      const setFields = (fields?: t.InfoField[]) => {
        dev.change((d) => (d.props.fields = fields));
        local.selectedFields = fields?.length === 0 ? undefined : fields;
      };

      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            style={{ Margin: [10, 10, 10, 15] }}
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(ev) => {
              const fields =
                ev.action === 'Reset:Default'
                  ? DEFAULTS.fields.default
                  : (ev.next as t.InfoProps['fields']);
              setFields(fields);
            }}
          />
        );
      });

      const config = (label: string, fields?: t.InfoField[]) => {
        dev.button(label, (e) => setFields(fields));
      };

      config('Default', DEFAULTS.fields.default);
      config('Info → PeerRepoList', ['Repo', 'Peer', 'Network.Shared', 'Network.Shared.Json']);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('connect network', (e) => peer.self.connect.data(peer.remote.id));
      dev.button('redraw', (e) => dev.redraw());
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
            <Dev.Object name={name} data={data} expand={1} style={styles.obj} />
            <PeerUI.Connector peer={peer.remote} style={styles.conn} />
          </div>
        );
      });
  });
});
