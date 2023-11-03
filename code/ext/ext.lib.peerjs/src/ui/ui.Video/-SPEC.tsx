import { COLORS, Color, Dev, UI, Webrtc, css, type t } from '../../test.ui';
import { PeerCard } from '../ui.Dev.PeerCard';

type T = {
  muted?: boolean;
  props: t.VideoProps;
};
const initial: T = { props: {} };

/**
 * Spec
 */
const name = 'Video';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  type LocalStore = Pick<T, 'muted'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs.ui.Video');
  const local = localstore.object({ muted: false });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.muted = local.muted;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <UI.Video {...e.state.props} peer={self} />;
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
            <UI.Connector
              peer={self}
              behavior={{ focusOnLoad: true }}
              onReady={(e) => console.info('⚡️ UI.Connector.onReady', e)}
            />
            <UI.AvatarTray
              peer={self}
              style={styles.avatars}
              muted={e.state.muted}
              onChange={(e) => {
                console.info(`⚡️ onClick`, e);
                state.change((d) => (d.props.stream = e.selected?.stream));
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
