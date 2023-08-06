import { Index } from '.';
import { Crdt, Dev, Is, TestFile, rx, type t } from '../../test.ui';
import { DevFile } from './-SEC.File';
import { DevItemEditor } from './-SPEC.ItemEditor';
import { DevSelected } from './-SPEC.Selected';

import type { T } from './-SPEC.t';

const initial: T = { props: {} };
const DEFAULTS = Index.DEFAULTS;

/**
 * Spec
 */
const name = Index.displayName ?? '';

export default Dev.describe(name, async (e) => {
  const { dispose, dispose$ } = rx.disposable();

  type LocalStore = Pick<t.IndexProps, 'focused' | 'editing' | 'selected' | 'scroll'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.Index');
  const local = localstore.object({
    focused: DEFAULTS.focused,
    editing: DEFAULTS.editing,
    selected: DEFAULTS.selected,
    scroll: DEFAULTS.scroll,
  });

  /**
   * (CRDT) Filesystem
   */
  const { dir, fs, doc, file } = await TestFile.init({ dispose$ });

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
      d.props.scroll = local.scroll;
      d.props.items = doc.current.slugs;
    });

    file.doc.$.subscribe((e) => {
      state.change((d) => (d.props.items = doc.current.slugs));
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(0.3)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        return (
          <Index
            {...e.state.props}
            style={{ width: 260 }}
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

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.scroll);
        btn
          .label((e) => `scroll`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.scroll = Dev.toggle(d.props, 'scroll'))));
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

          const el = Crdt.toObject(slugs[toIndex]);
          slugs.splice(toIndex, 1);
          slugs.splice(fromIndex, 0, el);
        });

        await state.change((d) => {
          d.props.items = doc.current.slugs;
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

    await DevFile(dev, fs, file, dir);

    dev.hr(0, 50);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        doc: doc.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
