import { WebrtcStore, css, Dev, Pkg, TestEdge, type t, TestDb } from '../../test.ui';
import { monitorPeer } from '../ui.Network.CmdHost/-SPEC';
import { DEFAULTS, NetworkCmdHost } from './common';
import { SampleLayout } from './ui.Layout';

type L = t.Lens;
type T = { reload?: boolean; theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'Network.CmdHosts';
export default Dev.describe(name, async (e) => {
  const logLevel = 'Debug';
  const left = await TestEdge.createEdge('Left', { logLevel, debugLabel: '🐷' });
  const right = await TestEdge.createEdge('Right', { logLevel, debugLabel: '🌼' });
  const lenses: { left?: L; right?: L } = {};

  type LocalStore = Pick<T, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: 'Dark' });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.theme = local.theme;
    });

    const toLens = (shared: t.NetworkStoreShared) => shared.namespace.lens('foo', {});
    monitorPeer(dev, left.network, (shared) => (lenses.left = toLens(shared)));
    monitorPeer(dev, right.network, (shared) => (lenses.right = toLens(shared)));

    ctx.debug.width(330);
    ctx.subject
      .display('grid')
      .size('fill')
      .render<T>(async (e) => {
        const { theme } = e.state;
        Dev.Theme.background(ctx, theme, 1);

        if (e.state.reload)
          return (
            <TestDb.DevReload
              theme={theme}
              onCloseClick={() => state.change((d) => (d.reload = false))}
            />
          );

        /**
         * TODO 🐷
         * - optionally load from env-var.
         */
        const { Specs } = await import('../../test.ui/entry.Specs.mjs');

        return (
          <SampleLayout
            pkg={Pkg}
            theme={theme}
            imports={Specs}
            left={lenses.left}
            right={lenses.right}
            path={DEFAULTS.paths}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    TestEdge.dev.headerFooterConnectors(dev, left.network, right.network);
    TestEdge.dev.peersSection(dev, left.network, right.network);
    dev.hr(5, 20);

    const data: t.InfoData = {
      shared: {
        // lens: ['ns', 'foo'],
        object: {
          beforeRender(mutate) {
            const doc = mutate as Partial<t.CrdtShared>;
            delete doc['.meta'];
            // NetworkCmdHost.Path.shortenUris(mutate as t.CmdHostPathLens);
          },
        },
      },
    };

    const render = (title: string, network: t.NetworkStore) => {
      const elTitle = <div {...css({ fontSize: 22 })}>{title}</div>;
      return dev.row((e) => {
        return TestEdge.dev.infoPanel(dev, network, { title: elTitle, data });
      });
    };

    render('🐷', left.network);
    dev.hr(5, 20);
    render('🌼', right.network);

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['theme'], (e) => (local.theme = e));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.button(['purge ephemeral', '💦'], (e) => {
        WebrtcStore.Shared.purge(left.network.index);
        WebrtcStore.Shared.purge(right.network.index);
        e.change((d) => (d.reload = true));
      });
    });

    dev.hr(5, 20);
  });
});