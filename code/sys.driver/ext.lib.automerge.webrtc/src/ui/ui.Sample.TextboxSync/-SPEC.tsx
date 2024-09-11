import { Dev, Immutable, Json, Pkg, rx, TestEdge, type t } from '../../test.ui';
import { Layout } from './ui.Layout';

type L = t.Lens;
type D = { theme?: t.CommonTheme };

/**
 * Spec
 */
const name = `${Pkg.name}:${'Sample.TextboxSync'}`;

export default Dev.describe(name, async (e) => {
  const left = await TestEdge.createEdge('Left');
  const right = await TestEdge.createEdge('Right');
  const lenses: { left?: L | undefined; right?: L } = {};

  type LocalStore = { debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ debug: undefined });

  const State = {
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, {})),
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const toLens = (shared: t.NetworkStoreShared) => shared.ns.lens('foo', { text: '' });
    lenses.left = toLens(left.network.shared);
    lenses.right = toLens(right.network.shared);

    const debug$ = State.debug.events().changed$;
    rx.merge(debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => (local.debug = Json.stringify(State.debug.current)));
    rx.merge(debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    const theme: t.CommonTheme = 'Dark';
    Dev.Theme.background(ctx, theme);
    ctx.debug.width(330);
    ctx.subject.display('grid').render<D>(() => {
      return (
        <Layout
          //
          left={lenses.left}
          right={lenses.right}
          path={['text']}
          theme={theme}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    TestEdge.dev.headerFooterConnectors(dev, left.network, right.network);
    TestEdge.dev.peersSection(dev, left.network, right.network);
    dev.hr(5, 20);
    TestEdge.dev.infoPanels(dev, left.network, right.network);
  });
});
