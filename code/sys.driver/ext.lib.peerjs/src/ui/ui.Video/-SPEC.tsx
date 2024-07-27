import { COLORS, Color, Dev, PeerUI, Webrtc, css, type t } from '../../test.ui';
import { PeerCard } from '../ui.Dev.PeerCard';

type P = t.VideoProps;
type T = {
  muted?: boolean;
  props: P;
};
const initial: T = { props: {} };

/**
 * Spec
 */
const name = 'Video';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  type LocalStore = Pick<T, 'muted'> & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs.ui.Video');
  const local = localstore.object({ muted: false, theme: undefined });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.muted = local.muted;
      d.props.theme = local.theme;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);
        return <PeerUI.Video {...props} peer={self} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.header
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        const styles = {
          avatars: css({
            padding: 8,
            borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
          }),
        };

        return (
          <div>
            <PeerUI.Connector
              peer={self}
              behaviors={['Focus.OnLoad']}
              onReady={(e) => console.info('⚡️ Connector.onReady:', e)}
            />
            <PeerUI.AvatarTray
              peer={self}
              style={styles.avatars}
              muted={e.state.muted}
              onSelection={(e) => {
                console.info(`⚡️ onClick`, e);
                state.change((d) => (d.props.stream = e.selected));
              }}
            />
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.muted);
        btn
          .label((e) => `muted`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.muted = Dev.toggle(d, 'muted'))));
      });

      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
    });

    dev.hr(-1, 5);

    const empty = (label: string, fn: (d: T) => void) => {
      dev.button(`empty: ${label}`, (e) => e.state.change((d) => fn(d)));
    };
    empty('undefined (default)', (d) => (d.props.empty = undefined));
    empty('null (nothing)', (d) => (d.props.empty = null));
    empty('text', (d) => (d.props.empty = '👋 Hello, World!'));
    empty('<Element>', (d) => {
      const style = css({ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: 10 });
      d.props.empty = <div {...style}>My Element</div>;
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button(['redraw', '(harness)'], (e) => dev.redraw());
    });

    dev.hr(5, 20);
    dev.row((e) => <PeerCard prefix={'peer.remote:'} peer={{ self: remote, remote: self }} />);
    dev.hr(5, 20);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        'peer.self': self.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
