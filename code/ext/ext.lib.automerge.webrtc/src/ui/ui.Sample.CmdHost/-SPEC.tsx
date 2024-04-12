import { Dev, Pkg, TestEdge, type t } from '../../test.ui';
import { SampleLayout } from './ui.Layout';
import { DEFAULTS } from './common';

type L = t.Lens;
type T = { theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.CmdHost';
export default Dev.describe(name, async (e) => {
  const left = await TestEdge.createEdge('Left');
  const right = await TestEdge.createEdge('Right');
  const lenses: { left?: L | undefined; right?: L } = {};

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
    monitorPeer(dev, left, (shared) => (lenses.left = toLens(shared)));
    monitorPeer(dev, right, (shared) => (lenses.right = toLens(shared)));

    ctx.debug.width(330);
    ctx.subject
      .display('grid')
      .size('fill')
      .render<T>(async (e) => {
        const { theme } = e.state;
        Dev.Theme.background(ctx, theme, 1);

        /**
         * TODO 🐷
         * - optionally load for env-var.
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
    TestEdge.dev.infoPanels(dev, left.network, right.network);

    dev.hr(5, 20);
    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['theme'], (e) => (local.theme = e));
    });
  });
});

/**
 * Helpers
 */
const monitorPeer = (
  dev: t.DevTools,
  edge: t.NetworkConnectionEdge,
  toLens?: (shared: t.NetworkStoreShared) => t.Lens,
) => {
  const handleConnection = async () => {
    toLens?.(await edge.network.shared());
    dev.redraw();
  };
  edge.network.peer.events().cmd.conn$.subscribe(handleConnection);
};
