import { DEFAULTS } from '.';
import { Dev, Doc, Immutable, Json, Pkg, rx, SampleCrdt, type t } from '../../test.ui';
import { Info } from '../../ui/ui.Info';
import { Layout } from './-ui';

type D = {
  theme?: t.CommonTheme;
  path?: t.ObjectPath;
  docuri?: string;
};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, async (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const State = {
    debug: Immutable.clonerRef<D>(
      Json.parse<D>(local.debug, {
        theme: 'Dark',
        path: ['text'],
        docuri: undefined,
      }),
    ),
  } as const;

  let doc: t.Doc | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);
    doc = await sample.get();

    const debug$ = State.debug.events().changed$;
    rx.merge(debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.debug = Json.stringify(State.debug.current);
      });
    rx.merge(debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size([null, null])
      .display('grid')
      .render<D>(() => {
        const { path, theme, docuri } = State.debug.current;
        Dev.Theme.background(ctx, theme);
        return <Layout theme={theme} repo={db.repo} docuri={docuri} path={path} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<D>(e);
    const state = await dev.state();
    dev.header.border(-0.1).render((e) => {
      const { store, index } = db.repo;
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
              uri: { head: true },
              object: { visible: false, expand: { level: 2 }, beforeRender(mutate) {} },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.debug);
      dev.hr(-1, 5);
      const path = (path: t.ObjectPath) => {
        const label = `path: [ ${path?.join('.')} ]`;
        dev.button(label, () => State.debug.change((d) => (d.path = path)));
      };
      path(['text']);
      path(['foo', 'text']);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', () => dev.redraw());
      dev.hr(-1, 5);
      dev.button('clear text', async () => {
        const doc = await sample.get();
        doc?.change((d) => (d.text = ''));
      });
      dev.button(['reset doc', '(delete fields)'], async () => {
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
          .right((e) => (doc ? `crdt:${Doc.Uri.shorten(doc.uri)}` : ''))
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>(() => {
      const debug = State.debug.current;
      const data = { path: debug };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
