import { Dev, Pkg, TestDb, WebStore, type t } from '../../test.ui';
import { Info } from '../../ui/ui.Info';
import { RepoList } from '../../ui/ui.RepoList';
import { Layout } from './-SPEC.ui';

type T = { theme?: t.CommonTheme; docuri?: string };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sync.Textbox';
export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });
  let model: t.RepoListModel;

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

    model = await RepoList.model(store, {
      behaviors: ['Copyable', 'Deletable'],
      onActiveChanged: (e) => {
        console.info(`⚡️ onActiveChanged`, e);
        state.change((d) => (d.docuri = e.item.uri));
      },
    });

    ctx.debug.width(330);
    ctx.subject
      .size([null, null])
      .display('grid')
      .render<T>((e) => {
        const { theme, docuri } = e.state;
        Dev.Theme.background(ctx, theme);
        return <Layout theme={theme} repo={model} docuri={docuri} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.row((e) => {
      const { store, index } = model;
      return (
        <Info
          stateful={true}
          fields={['Component', 'Repo', 'Doc', 'Doc.URI', 'Doc.Head']}
          data={{
            component: { name },
            repo: { store, index },
            document: { doc: e.state.docuri },
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['theme'], (next) => (local.theme = next));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        return <RepoList model={model} onReady={(e) => e.ref.select(0)} />;
      });
  });
});
