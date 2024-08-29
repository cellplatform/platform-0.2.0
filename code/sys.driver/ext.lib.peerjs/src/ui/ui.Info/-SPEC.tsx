import { Info } from '.';
import { COLORS, Color, Dev, Webrtc, css, type t } from '../../test.ui';
import { Connector } from '../ui.Connector';

type P = t.InfoProps;
type T = { props: P };
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  type LocalStore = Pick<P, 'fields' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({
    theme: undefined,
    fields: DEFAULTS.fields.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.fields = local.fields;
      d.props.margin = 10;
    });

    ctx.debug.width(330);
    ctx.subject
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);
        return <Info {...props} self={self} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => {
        return <Connector peer={self} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      const setFields = (fields?: t.InfoField[]) => {
        dev.change((d) => (d.props.fields = fields));
        local.fields = fields?.length === 0 ? undefined : fields;
      };

      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(e) => setFields(e.next<t.InfoField>(DEFAULTS.fields.default))}
          />
        );
      });

      dev.title('Common States');
      const config = (label: string, fields?: t.InfoField[]) => {
        dev.button(label, (e) => setFields(fields));
      };

      config('all', DEFAULTS.fields.all);
      config('peers + remotes', ['Peer', 'Peer.Remotes']);
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
      dev.button(['connect', '⚡️'], (e) => self.connect.data(remote.id));
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
            <Connector peer={remote} style={styles.conn} />
          </div>
        );
      });
  });
});
