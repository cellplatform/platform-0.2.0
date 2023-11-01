import { type t, COLORS, Color, Dev, UI, Webrtc, css } from '../../test.ui';

const DEFAULTS = UI.Video.DEFAULTS;

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
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        const borderBottom = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
        const styles = {
          obj: css({ padding: 8, borderBottom }),
          avatars: css({ padding: 8, borderBottom }),
        };

        const data = {
          'peer.self': self.current,
        };

        return (
          <div>
            <Dev.Object name={name} data={data} expand={1} style={styles.obj} />
            <UI.AvatarTray
              peer={self}
              style={styles.avatars}
              muted={e.state.muted}
              onChange={(e) => {
                console.info(`⚡️ onClick`, e);
                state.change((d) => (d.props.stream = e.selected?.stream));
              }}
            />
            <UI.Connector peer={self} behavior={{ focusOnLoad: true }} />
          </div>
        );
      });
  });
});
