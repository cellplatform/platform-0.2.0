import { css, Dev, Color, COLORS, type t, UI, Webrtc, Video } from '../../test.ui';

type T = { stream?: MediaStream };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.03';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Video stream={e.state.stream} muted={true} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
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
          avatars: css({ padding: 8, borderBottom }),
        };

        return (
          <div>
            <UI.AvatarTray
              peer={self}
              style={styles.avatars}
              muted={false}
              onClick={(e) => {
                console.info(`⚡️ onClick`, e);
                state.change((d) => (d.stream = e.stream));
              }}
            />
            <UI.Connector peer={self} behavior={{ focusOnLoad: true }} />
          </div>
        );
      });
  });
});
