import { AvatarTray } from '.';
import { Slider, Dev, Webrtc, type t } from '../../test.ui';
import { Connector } from '../ui.Connector';
import { PeerCard } from '../ui.Sample.02/ui.PeerCard';

type T = { props: t.AvatarTrayProps };
const initial: T = { props: {} };
const name = AvatarTray.displayName ?? '';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return (
          <AvatarTray
            {...e.state.props}
            style={{ margin: 10 }}
            peer={self}
            onChange={(e) => {
              console.log('⚡️ onChange:', e);
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
        return <Slider />;
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
        props: e.state.props,
        peer: self.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
