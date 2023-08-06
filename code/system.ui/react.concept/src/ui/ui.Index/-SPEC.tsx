import { Index } from '.';
import { Crdt, CrdtViews, Dev, File, Is, TestFilesystem, rx, type t } from '../../test.ui';
import { DevItemEditor } from './-SPEC.ItemEditor';
import { DevSelected } from './-SPEC.Selected';
import { DevFile } from './-SEC.File';

import type { T, TDoc } from './-SPEC.t';

const initial: T = { props: {} };
const DEFAULTS = Index.DEFAULTS;

/**
 * Spec
 */
const name = Index.displayName ?? '';

export default Dev.describe(name, async (e) => {
  const { dispose, dispose$ } = rx.disposable();

  type LocalStore = Pick<t.IndexProps, 'focused' | 'editing' | 'selected'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.Index');
  const local = localstore.object({
    focused: DEFAULTS.focused,
    editing: DEFAULTS.editing,
    selected: DEFAULTS.selected,
  });

  /**
   * (CRDT) Filesystem
   */
  const dir = 'dev/concept/index.spec';
  const fs = (await TestFilesystem.client()).fs.dir(dir);
  const docid = 'dev-index';
  const doc = Crdt.ref<TDoc>(docid, { slugs: [] });
  const file = await Crdt.file<TDoc>(fs, doc, { autosave: true, dispose$ });
  const Doc = {
    slugs: () => doc.current.slugs.map((item) => item),
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
      d.props.editing = local.editing;
      d.props.selected = local.selected;
      d.props.items = Doc.slugs();
    });

    file.doc.$.subscribe((e) => {
      const items = Doc.slugs();
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
            onSlugEditStart={(e) => {
              console.info('⚡️ onSlugEditStart', e);
              state.change((d) => (local.editing = d.props.editing = true));
            }}
            onSlugEditComplete={async (e) => {
              console.info('⚡️ onSlugEdited', e);
              await state.change((d) => (local.editing = d.props.editing = false));
              doc.change((d) => {
                if (Is.slug(d.slugs[e.index])) d.slugs[e.index].title = e.title;
              });
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const Selected = DevSelected(state, doc);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focused);
        btn
          .label((e) => `focused`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.focused = Dev.toggle(d.props, 'focused'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.editing);
        btn
          .label((e) => `editing`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.editing = Dev.toggle(d.props, 'editing'))));
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

    dev.section('Move', (dev) => {
      const move = async (by: number) => {
        const fromIndex = state.current.props.selected ?? -1;
        const toIndex = fromIndex + by;
        if (fromIndex < 0 || toIndex > doc.current.slugs.length - 1) return;

        doc.change((d) => {
          const slugs = d.slugs;
          if (!slugs[fromIndex]) return;
          var element = slugs[toIndex];
          slugs.splice(toIndex, 1);
          slugs.splice(fromIndex, 0, Crdt.toObject(element));
        });

        await state.change((d) => {
          d.props.items = Doc.slugs();
          local.selected = d.props.selected = toIndex;
        });

        dev.redraw();
      };

      dev.button('↑ up', (e) => move(-1));
      dev.button('↓ down', (e) => move(+1));
    });

    dev.hr(5, 20);
    await DevItemEditor(dev, doc);
    dev.hr(5, 20);

    await DevFile(dev, file, dir);

    dev.hr(0, 50);
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
