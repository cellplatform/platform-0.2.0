import { DEFAULTS, HistoryGrid } from '.';
import { Dev, Doc, Pkg, SampleCrdt, type t } from '../../test.ui';

type P = t.HistoryGridProps;
type T = { props: P };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  const db = await SampleCrdt.init();

  type LocalStore = Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: undefined });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
    });

    ctx.debug.width(330);
    ctx.subject
      .size([300, null])
      .display('grid')
      .render<T>(async (e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1, 0.02);

        const doc = await db.docAtIndex(0);
        const history = Doc.history(doc);
        const page = history.page(0, 5, 'desc');

        return <HistoryGrid {...props} page={page} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>(async (e) => {
      const crdt = (await db.docAtIndex(0))?.current;
      const data = {
        ...e.state,
        'crdt:storage:db': db.storage.name,
        'crdt:doc': crdt,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
