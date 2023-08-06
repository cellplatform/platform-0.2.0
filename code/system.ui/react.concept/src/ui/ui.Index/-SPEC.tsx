import { Index } from '.';
import { Crdt, CrdtViews, Dev, File, TestFilesystem, cuid, rx, type t } from '../../test.ui';

const DEFAULTS = Index.DEFAULTS;
type T = { props: t.IndexProps };
const initial: T = { props: {} };

type Doc = { slugs: t.SlugListItem[] };

/**
 * Spec
 */
const name = Index.displayName ?? '';

export default Dev.describe(name, async (e) => {
  const { dispose, dispose$ } = rx.disposable();

  type LocalStore = Pick<t.IndexProps, 'focused' | 'selected'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.Index');
  const local = localstore.object({
    focused: DEFAULTS.focused,
    selected: DEFAULTS.selected,
  });

  /**
   * (CRDT) Filesystem
   */
  const dir = 'dev/concept/index.spec';
  const fs = (await TestFilesystem.client()).fs.dir(dir);
  const docid = 'dev-index';
  const doc = Crdt.ref<Doc>(docid, { slugs: [] });
  const file = await Crdt.file<Doc>(fs, doc, { autosave: true, dispose$ });
  const Doc = {
    cloneSlugs: () => doc.current.slugs.map((item) => item),
  };

  /**
   * Initialize.
   */
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.focused = local.focused;
      d.props.selected = local.selected;
      d.props.items = Doc.cloneSlugs();
    });

    file.doc.$.subscribe((e) => {
      const items = Doc.cloneSlugs();
      state.change((d) => (d.props.items = items));
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(0.3)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        const width = 200;
        return (
          <Index
            {...e.state.props}
            style={{ width }}
            onSelect={(e) => {
              state.change((d) => (local.selected = d.props.selected = e.index));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focused);
        btn
          .label((e) => `focused`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.focused = Dev.toggle(d.props, 'focused'))));
      });

      dev.hr(-1, 5);
      dev.button('(reset)', (e) => {
        e.change((d) => {
          d.props.focused = undefined;
          d.props.selected = undefined;
        });
      });
    });

    dev.hr(5, 20);

    dev.section('Add', (dev) => {
      dev.button('add: section', (e) => {
        const section: t.SlugNamespace = { namespace: `Hello 👋` };
        doc.change((d) => d.slugs.push(section));
      });

      dev.button('add: slug', (e) => {
        const slug: t.Slug = { id: cuid() };
        doc.change((d) => d.slugs.push(slug));
      });
    });

    dev.hr(5, 20);

    dev.section('File', (dev) => {
      dev.button('⚠️ delete file', () => {
        file.delete();
        state.change((d) => (d.props.items = undefined));
      });
      dev.hr(0, 6);

      dev.row((e) => {
        return (
          <CrdtViews.Info
            card={true}
            fields={[
              'Module',
              'History',
              'History.Item',
              'History.Item.Message',
              'File',
              'File.Driver',
            ]}
            data={{
              file: { doc: file, path: dir },
              history: { data: doc.history },
            }}
          />
        );
      });

      dev.hr(0, 6);

      const getJson = () => JSON.stringify(file.doc.current, null, '  ');

      dev.button(['download (json)', '↓'], () => {
        const bytes = new TextEncoder().encode(getJson());
        const blob = new Blob([bytes], { type: 'application/json' });
        File.download('foo.json', blob, { mimetype: 'application/json' });
      });

      dev.button('copy (json)', () => {
        navigator.clipboard.writeText(getJson());
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
