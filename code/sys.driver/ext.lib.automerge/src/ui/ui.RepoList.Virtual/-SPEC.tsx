import { RepoListVirtual } from '.';
import { Dev, DevReload, Pkg, TestDb, WebStore, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type T = {
  props: t.RepoListVirtualProps;
  debug: { reload?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = RepoListVirtual.displayName ?? 'Unknown';
export default Dev.describe(name, (e) => {
  const storage = TestDb.Spec.name;
  let model: t.RepoListModel;

  type LocalStore = Pick<t.RepoListModel, 'behaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.ui.${name}`);
  const local = localstore.object({
    behaviors: RepoListVirtual.DEFAULTS.behaviors.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const store = WebStore.init({ storage });
    model = await RepoListVirtual.model(store, {});

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        const width = 330;
        if (e.state.debug.reload) return <DevReload style={{ width }} />;
        return <RepoListVirtual {...e.state.props} style={{ width }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.TODO();

    dev.row((e) => {
      const name = '<RepoList.Virtual>';
      const { store, index } = model;
      return (
        <Info
          fields={['Component', 'Repo']}
          repos={{ main: { store, index } }}
          data={{ repo: 'main', component: { name } }}
        />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      return (
        <RepoListVirtual.Config
          selected={local.behaviors}
          onChange={(e) => {
            local.behaviors = e.next || [];
            dev.redraw();
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.hr(-1, 5);

      dev.button([`delete database: "${storage}"`, '💥'], async (e) => {
        e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
