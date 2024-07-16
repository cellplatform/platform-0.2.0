import { DEFAULTS } from '.';
import { Dev, Pkg, SampleCrdt, type t } from '../../test.ui';
import { Info } from '../../ui/ui.Info';
import { Layout } from './-ui';

type T = {
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  docuri?: string;
};
const initial: T = {};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<T, 'theme' | 'path' | 'docuri'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    path: ['text'],
    docuri: undefined,
  });

  let doc: t.Doc | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.store);

    await state.change((d) => {
      d.theme = local.theme;
      d.path = local.path;
      d.docuri = local.docuri;
    });
    doc = await sample.get();

    ctx.debug.width(330);
    ctx.subject
      .size([null, null])
      .display('grid')
      .render<T>((e) => {
        const { path, theme, docuri } = e.state;
        Dev.Theme.background(ctx, theme);
        return <Layout theme={theme} repo={db} docuri={docuri} path={path} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.header.border(-0.1).render((e) => {
      const { store, index } = db;
      const ref = state.current.docuri;
      return (
        <Info
          stateful={true}
          fields={['Component', 'Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            component: { name },
            repo: { store, index },
            document: {
              ref,
              object: { visible: false, expand: { level: 2 }, beforeRender(mutate) {} },
              uri: { head: true },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const sample = SampleCrdt.dev(state, local, db.store);
    const link = Dev.Link.pkg(Pkg, dev);

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
        const doc = await sample.get();
        doc?.change((d) => (d.text = ''));
      });
      dev.button(['reset doc', '(delete fields)'], async (e) => {
        const doc = await sample.get();
        doc?.change((d) => {
          Object.keys(d).forEach((key) => delete (d as any)[key]);
        });
      });
    });

    dev.hr(5, 20);

    dev.section(['Sample State', 'CRDT'], (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled((e) => !doc)
          .onClick(async (e) => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { path: e.state.path };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
