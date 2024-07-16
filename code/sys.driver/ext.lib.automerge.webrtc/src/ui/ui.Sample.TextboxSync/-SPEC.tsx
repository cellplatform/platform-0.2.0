import { Dev, Pkg, TestEdge, type t } from '../../test.ui';
import { Layout } from './ui.Layout';

type L = t.Lens;
type T = { theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.TextboxSync';
export default Dev.describe(name, async (e) => {
  const left = await TestEdge.createEdge('Left');
  const right = await TestEdge.createEdge('Right');
  const lenses: { left?: L | undefined; right?: L } = {};

  type LocalStore = {};
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({});

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const toLens = (shared: t.NetworkStoreShared) => shared.ns.lens('foo', { text: '' });
    lenses.left = toLens(left.network.shared);
    lenses.right = toLens(right.network.shared);

    const theme: t.CommonTheme = 'Dark';
    Dev.Theme.background(ctx, theme);
    ctx.debug.width(330);
    ctx.subject.display('grid').render<T>(async (e) => {
      return <Layout left={lenses.left} right={lenses.right} path={['text']} theme={theme} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    TestEdge.dev.headerFooterConnectors(dev, left.network, right.network);
    TestEdge.dev.peersSection(dev, left.network, right.network);
    dev.hr(5, 20);
    TestEdge.dev.infoPanels(dev, left.network, right.network);
  });
});
