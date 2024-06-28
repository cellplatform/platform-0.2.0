import { Dev, Pkg, TestDb, WebStore, type t } from '../../test.ui';
import { Info } from '../../ui/ui.Info';
import { RepoList } from '../../ui/ui.RepoList';
import { Layout, type TDoc } from './-SPEC.ui';

type T = {
  fields?: t.InfoField[];
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  docuri?: string;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sync.Textbox';
export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });
  let model: t.RepoListModel;

  type LocalStore = Pick<T, 'theme' | 'fields' | 'path'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    path: ['text'],
    theme: 'Dark',
    fields: ['Component', 'Repo', 'Doc', 'Doc.URI'],
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.theme = local.theme;
      d.fields = local.fields;
      d.path = local.path;
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
        const { path, theme, docuri } = e.state;
        Dev.Theme.background(ctx, theme);
        return <Layout theme={theme} repo={model} docuri={docuri} path={path} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    const getDoc = () => {
      const uri = state.current.docuri;
      return store.doc.get<TDoc>(uri);
    };

    dev.row((e) => {
      const { store, index } = model;
      return (
        <Info
          stateful={true}
          fields={e.state.fields}
          data={{
            component: { name },
            repo: { store, index },
            document: { ref: e.state.docuri, uri: { head: true } },
          }}
          onStateChange={(e) => {
            dev.change((d) => (local.fields = d.fields = e.fields));
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['theme'], (next) => (local.theme = next));

      dev.hr(-1, 5);

      const path = (path: t.ObjectPath) => {
        dev.button(`path: [ ${path?.join('.')} ]`, (e) => {
          e.change((d) => (local.path = d.path = path));
        });
      };
      path(['text']);
      path(['foo', 'text']);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.button('clear text', async (e) => {
        const doc = await getDoc();
        doc?.change((d) => (d.text = ''));
      });
      dev.button('reset doc', async (e) => {
        const doc = await getDoc();
        doc?.change((d) => {
          Object.keys(d).forEach((key) => delete (d as any)[key]);
        });
      });
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
