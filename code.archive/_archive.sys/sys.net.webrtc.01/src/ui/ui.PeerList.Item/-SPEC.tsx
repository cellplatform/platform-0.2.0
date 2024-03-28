import { Dev, TestNetwork } from '../../test.ui';
import { PeerListItem, PeerListItemProps } from '.';

type T = { props: PeerListItemProps };
const initial: T = { props: {} };

export default Dev.describe('PeerList.Item', async (e) => {
  e.timeout(9999);

  type LocalStore = { debug: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerList.Item');
  const local = localstore.object({ debug: true });

  const network = await TestNetwork.init();

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.debug = local.debug;
    });

    ctx.subject
      .display('grid')
      .size([380, null])
      .render<T>((e) => {
        return (
          <PeerListItem
            {...e.state.props}
            onCloseRequest={() => console.info(`⚡️ onCloseRequeset`)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.title('PeerList (Item)').hr();

    dev.TODO('');

    dev.boolean((btn) =>
      btn
        .label('debug')
        .value((e) => e.state.props.debug)
        .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.props, 'debug')))),
    );

    dev.hr();

    dev.button('connect', async (e) => {
      await network.connect();
      await e.change(async (d) => {
        const self = network.peerA;
        const connections = self.connectionsByPeer.find((p) => p.peer.local === self.id);
        d.props.connections = connections;
      });
    });

    dev.button('disconnect', async (e) => {
      network.peerA.connections.all.forEach((conn) => conn.dispose());
      await e.change((d) => (d.props.connections = undefined));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'PeerList.Item'} data={e.state} expand={1} />);
  });
});
