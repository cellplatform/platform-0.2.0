import { Dev, PeerUI, Pkg, type t, css } from '../../test.ui';
import { PeerRepoList } from '../ui.PeerRepoList';
import { createEdge } from '../ui.NetworkConnection/-SPEC';
import { SampleLayout } from './-SPEC.ui';

type TLens = { text: string };
type T = { theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'TextboxSync';
export default Dev.describe(name, async (e) => {
  const left = await createEdge('Left');
  const right = await createEdge('Right');
  let lens: t.Lens<TLens> | undefined;

  type LocalStore = {};
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({});

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const monitorPeer = (
      edge: t.NetworkConnectionEdge,
      onShared?: (e: t.NetworkStoreShared) => void,
    ) => {
      const peer = edge.network.peer.events();
      peer.cmd.conn$.subscribe(async (e) => {
        if (onShared) onShared(await edge.network.shared());
        dev.redraw('debug');
      });
    };
    monitorPeer(right);
    monitorPeer(left, (shared) => {
      lens = shared.namespace.lens<TLens>('foo', { text: '' });
      dev.redraw('subject');
    });

    const theme: t.CommonTheme = 'Dark';
    Dev.Theme.background(ctx, theme);
    ctx.debug.width(330);
    ctx.subject.display('grid').render<T>(async (e) => {
      if (!lens) return null;
      return <SampleLayout doc={lens} path={['text']} theme={theme} />;
    });
  });

  e.it('ui:header', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={left.network.peer} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Peers', (dev) => {
      const connect = () => left.network.peer.connect.data(right.network.peer.id);
      const disconnect = () => left.network.peer.disconnect();
      const isConnected = () => left.network.peer.current.connections.length > 0;

      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'connected' : 'connect'))
          .right((e) => (!isConnected() ? '🌳' : ''))
          .enabled((e) => !isConnected())
          .onClick((e) => connect());
      });
      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'disconnect' : 'not connected'))
          .right((e) => (isConnected() ? '💥' : ''))
          .enabled((e) => isConnected())
          .onClick((e) => disconnect());
      });
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const network = left.network;

      return (
        <PeerRepoList.Info
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared', 'Network.Shared.Json']}
          data={{ network }}
        />
      );
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={right.network.peer} />);
  });
});
