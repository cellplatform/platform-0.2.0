import { DEFAULTS, HistoryGrid } from '.';
import { Dev, Doc, Pkg, SampleCrdt, type t } from '../../test.ui';

type P = t.HistoryGridProps;
type T = {
  docuri?: t.UriString;
  props: P;
};
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  const db = await SampleCrdt.init();

  type LocalStore = Pick<T, 'docuri'> & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: undefined });

  let doc: t.Doc | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.repo.store);

    await state.change((d) => {
      d.props.theme = local.theme;
    });
    doc = await sample.get();

    ctx.debug.width(330);
    ctx.subject
      .size([300, null])
      .display('grid')
      .render<T>(async (e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1, 0.02);

        const history = Doc.history(doc);
        const page = history.page(0, 5, 'desc');

        return <HistoryGrid {...props} page={page} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const sample = SampleCrdt.dev(state, local, db.repo.store);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });

    dev.hr(5, 20);

    dev.section('Data: Mutate', (dev) => {
      const mutate = (
        label: string | [string, string],
        fn: (e: { doc: t.Doc }) => any | Promise<any>,
      ) => {
        const labels = Array.isArray(label) ? label : [label, ''];
        dev.button((btn) => {
          btn
            .label(labels[0])
            .right(labels[1])
            .enabled((e) => !!doc)
            .onClick((e) => {
              if (doc) fn({ doc });
              dev.redraw();
            });
        });
      };

      mutate(['increment', 'count + 1'], async (e) => {
        type T = { count?: number };
        const doc = e.doc as t.Doc<T>;
        doc.change((d) => (d.count = (d.count ?? 0) + 1));
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
          .right((e) => (doc ? `crdt:${Doc.Uri.shorten(doc)}` : ''))
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>(async (e) => {
      const crdt = doc?.current;
      const data = {
        docuri: Doc.Uri.shorten(e.state.docuri),
        props: e.state.props,
        'crdt:storage:db': db.storage.name,
        'crdt:doc': crdt,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
