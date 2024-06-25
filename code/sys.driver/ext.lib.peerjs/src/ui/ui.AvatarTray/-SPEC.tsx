import { AvatarTray, DEFAULTS } from '.';
import { Dev, Pkg, Slider, Webrtc, type t } from '../../test.ui';
import { Connector } from '../ui.Connector';
import { PeerCard } from '../ui.Dev.PeerCard';

type P = t.AvatarTrayProps;
type T = {
  props: P;
  debug: { sizePercent?: number };
};
const initial: T = { props: {}, debug: {} };
const name = AvatarTray.displayName ?? '';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  type LocalStore = T['debug'] & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    sizePercent: 0.5,
    theme: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.debug.sizePercent = local.sizePercent;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);

        const size = Number(debug.sizePercent) * (DEFAULTS.size * 2);
        return (
          <AvatarTray
            {...props}
            peer={self}
            size={size}
            onSelection={(e) => {
              console.log('⚡️ onChange:', e);
              state.change((d) => (d.props.selected = e.selected));
            }}
          />
        );
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => {
        return <Connector peer={self} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.row((e) => {
        return (
          <Slider
            style={{ MarginX: 15, marginTop: 10, marginBottom: 15 }}
            percent={e.state.debug.sizePercent}
            track={{ height: 5 }}
            thumb={{ size: 12 }}
            onChange={(e) => {
              state.change((d) => (local.sizePercent = d.debug.sizePercent = e.percent));
            }}
          />
        );
      });

      dev.hr(-1, 5);
      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
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
        props: e.state.props,
        peer: self.current,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={12} />;
    });
  });
});
