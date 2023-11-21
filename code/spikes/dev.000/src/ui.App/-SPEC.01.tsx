import { UI as Crdt } from 'ext.lib.automerge';
import { UI as Webrtc } from 'ext.lib.peerjs';

import { COLORS, Color, Dev, css } from '../test.ui';
import { View } from './-SPEC.01.View';

type T = { stream?: MediaStream };
const initial: T = {};

/**
 * Spec
 */
const name = 'App.01';

export default Dev.describe(name, async (e) => {
  const self = Webrtc.peer();
  const store = Crdt.WebStore.init();
  const repo = await Crdt.RepoList.model(store);

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
        return <View stream={e.state.stream} repo={repo} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row(async (e) => {
      const { Auth } = await import('ext.lib.auth.privy');
      return (
        <Auth.Info
          data={{ provider: Auth.Env.provider }}
          fields={['Auth.Login', 'Id.User', 'Id.User.Phone', 'Auth.Link.Wallet', 'Wallet.List']}
          onChange={(e) => console.info('⚡️ Auth.onChange:', e)}
        />
      );
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
          avatars: css({ padding: 8, borderBottom }),
        };

        return (
          <div>
            <Webrtc.AvatarTray
              peer={self}
              style={styles.avatars}
              muted={false}
              onSelection={(e) => {
                console.info(`⚡️ AvatarTray.onSelection`, e);
                state.change((d) => (d.stream = e.selected));
              }}
            />
            <Webrtc.Connector peer={self} behaviors={['Focus.OnLoad']} />
          </div>
        );
      });
  });
});
