import { MediaToolbar } from '.';
import { Dev, Webrtc, type t } from '../../test.ui';
import { PeerCard } from '../ui.Sample.02/ui.PeerCard';

const DEFAULTS = MediaToolbar.DEFAULTS;

type T = { props: t.MediaToolbarProps };
const initial: T = { props: {} };
const name = MediaToolbar.displayName ?? '';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();

  type LocalStore = Pick<T['props'], 'selected' | 'focused'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs.ui.Connector.MediaToolbar');
  const local = localstore.object({
    selected: DEFAULTS.selected,
    focused: DEFAULTS.focused,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.peer = self;
      d.props.selected = local.selected;
      d.props.focused = local.focused;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <MediaToolbar {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.TODO((e) => e.style({ margin: [null, null, 30, null] }));

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.selected);
        btn
          .label((e) => `selected`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.selected = Dev.toggle(d.props, 'selected'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focused);
        btn
          .label((e) => `focused`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.focused = Dev.toggle(d.props, 'focused'))));
      });
    });

    dev.hr(5, 20);
    dev.row((e) => <PeerCard prefix={'peer.self:'} peer={{ self, remote }} />);
    dev.hr(5, 20);
    dev.row((e) => <PeerCard prefix={'peer.remote:'} peer={{ self: remote, remote: self }} />);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
