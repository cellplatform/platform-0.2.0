import { Dev, Immutable, Json, Pkg, rx, TestEdge, type t } from '../../test.ui';
import { Layout } from './ui.Layout';

type L = t.Lens;
type D = { theme?: t.CommonTheme };

/**
 * Spec
 */
const name = `${Pkg.name}:${'Sample.TextboxSync'}`;

export default Dev.describe(name, async (e) => {
  const top = await TestEdge.createEdge('Left');
  const bottom = await TestEdge.createEdge('Right');
  const lenses: { top?: L | undefined; bottom?: L } = {};

  type LocalStore = { debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ debug: undefined });

  const State = {
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { theme: 'Dark' })),
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const toLens = (shared: t.NetworkStoreShared) => shared.ns.lens('foo', { text: '' });
    lenses.top = toLens(top.network.shared);
    lenses.bottom = toLens(bottom.network.shared);

    const debug$ = State.debug.events().changed$;
    rx.merge(debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => (local.debug = Json.stringify(State.debug.current)));
    rx.merge(debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    ctx.debug.width(330);
    ctx.subject.display('grid').render<D>(() => {
      const debug = State.debug.current;
      const theme = debug.theme;
      Dev.Theme.background(ctx, theme);

      return (
        <Layout
          //
          left={lenses.top}
          right={lenses.bottom}
          path={['text']}
          theme={theme}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    TestEdge.dev.headerFooterConnectors(dev, top.network, bottom.network);
    TestEdge.dev.peersSection(dev, top.network, bottom.network);
    dev.hr(5, 20);
    TestEdge.dev.infoPanels(dev, top.network, bottom.network);

    dev.hr(5, 30);

    dev.section('Debug', (dev) => {
      Dev.Theme.immutable(dev, State.debug);
      dev.hr(-1, 15);
      dev.row(() => {
        const data = top.network.shared.doc.current;
        return (
          <Dev.Object
            name={'top.system'}
            data={data}
            fontSize={11}
            expand={{ paths: ['$', '$.sys', '$.sys.peers'] }}
          />
        );
      });
    });
  });
});
