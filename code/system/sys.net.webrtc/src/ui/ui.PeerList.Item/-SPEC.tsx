import { Dev } from '../../test.ui';
import { PeerListItem, PeerListItemProps } from '.';

type T = { props: PeerListItemProps };
const initial: T = { props: {} };

export default Dev.describe('PeerList.Item', (e) => {
  type LocalStore = { debug: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerList.Item');
  const local = localstore.object({ debug: true });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.debug = local.debug;
    });

    ctx.subject
      .display('grid')
      .size(380, null)
      .render<T>((e) => {
        return <PeerListItem {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.title('PeerList Item').hr();

    dev.boolean((btn) =>
      btn
        .label('debug')
        .value((e) => e.state.props.debug)
        .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.props, 'debug')))),
    );

    dev.hr();
  });
});
