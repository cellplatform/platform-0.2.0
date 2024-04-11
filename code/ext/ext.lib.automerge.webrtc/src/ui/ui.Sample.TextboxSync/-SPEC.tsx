import { Dev, PeerUI, Pkg, type t } from '../../test.ui';
import { PeerRepoList } from '../ui.PeerRepoList';
import { initSampleCrdt } from './state.crdt';
import { SampleLayout } from './ui';

type L = t.Lens;
type T = { theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.TextboxSync';
export default Dev.describe(name, async (e) => {
  const lenses: { left?: L | undefined; right?: L } = {};
  const { left, right, monitorPeer, peersSection } = await initSampleCrdt();

  type LocalStore = {};
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({});

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    monitorPeer(dev, left, (e) => (lenses.left = e.lens));
    monitorPeer(dev, right, (e) => (lenses.right = e.lens));

    const theme: t.CommonTheme = 'Dark';
    Dev.Theme.background(ctx, theme);
    ctx.debug.width(330);
    ctx.subject.display('grid').render<T>(async (e) => {
      if (!(lenses.left && lenses.right)) return null;
      return <SampleLayout left={lenses.left} right={lenses.right} path={['text']} theme={theme} />;
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

    peersSection(dev).hr(5, 20);

    const renderInfo = (network: t.NetworkStore) => {
      return (
        <PeerRepoList.Info
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared', 'Network.Shared.Json']}
          data={{ network }}
        />
      );
    };

    dev.row((e) => renderInfo(left.network));
    dev.hr(5, 20);
    dev.row((e) => renderInfo(right.network));
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={right.network.peer} />);
  });
});
