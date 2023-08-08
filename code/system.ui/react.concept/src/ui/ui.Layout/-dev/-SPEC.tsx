import { Dev, Icons, TestFile, Vimeo, rx, slug, type t } from '../../../test.ui';

import { Layout } from '..';

const DEFAULTS = Layout.DEFAULTS;

type T = {
  props: t.LayoutProps;
  debug: { withSlugs?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

/**
 * Spec
 */
const name = 'Layout';

export default Dev.describe(name, async (e) => {
  const { dispose, dispose$ } = rx.disposable();

  type LocalStore = Pick<T['debug'], 'withSlugs'> & Pick<t.LayoutProps, 'focused' | 'selected'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.Layout');
  const local = localstore.object({
    withSlugs: true,
    selected: -1,
    focused: DEFAULTS.focused,
  });

  const bus = rx.bus();
  const vimeo: t.VimeoInstance = { bus, id: `foo.${slug()}` };
  const player = Vimeo.Events(vimeo);

  /**
   * (CRDT) Filesystem
   */
  const { dir, fs, doc, file } = await TestFile.init({ dispose$ });

  const State = {
    displayProps(state: T): t.LayoutProps {
      const { debug } = state;
      const props: t.LayoutProps = { ...state.props };
      if (!debug.withSlugs) delete props.slugs;
      return props;
    },
  };

  /**
   * Initialize
   */
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      // d.props.selected = local.selected;
      d.props.slugs = doc.current.slugs;
      d.debug.withSlugs = local.withSlugs;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const props = State.displayProps(e.state);
        return (
          <Layout
            {...props}
            onSelect={(e) => {
              // state.change((d) => (d.props.selected = e.index));
              // local.selected = e.index;
            }}
            onVideo={(e) => {
              // console.info('⚡️ onVideo:', e);
              /**
               * TODO 🐷
               * - on play complete >> Next Slug
               */
              //   console.info('⚡️ onPlayComplete:', e);
              //   const { slugs, selected } = state.current.props;
              //   const next = Wrangle.nextSlug(slugs, selected);
              //   if (next.exists) state.change((d) => (d.props.selected = next.index));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      const focused = (value?: t.LayoutFocused, label?: string) => {
        const current = (state: T) => state.props.focused;
        dev.button((btn) => {
          btn
            .label(`focused: ${label ?? value}`)
            .right((e) => (current(e.state) === value ? '←' : ''))
            .onClick((e) => e.change((d) => (local.focused = d.props.focused = value)));
        });
      };

      focused(undefined, '(undefined)');
      dev.hr(-1, 5);
      focused('index');
      focused('player.footer');
    });

    dev.hr(-1, [5, 10]);

    dev.section('Video', (dev) => {
      dev.button((btn) => {
        btn
          .label('play')
          .right((e) => <Icons.Play size={16} />)
          .onClick((e) => player.play.fire());
      });

      dev.button((btn) => {
        btn
          .label('pause')
          .right((e) => <Icons.Pause size={16} />)
          .onClick((e) => player.pause.fire());
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        btn
          .label('restart')
          .right((e) => <Icons.Replay size={16} />)
          .onClick((e) => {
            player.seek.start();
            player.play.fire();
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state);
        btn
          .label((e) => `with slugs (data)`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.withSlugs = Dev.toggle(d.debug, 'withSlugs'))));
      });

      dev.hr(5, 20);

      const select = (index: number) => {
        dev.button((btn) => {
          const value = (state: T) => state.props.selected ?? -1;
          btn
            .label((e) => `select: ${index}`)
            .right((e) => (value(e.state) === index ? '←' : ''))
            .onClick((e) => e.change((d) => (local.selected = d.props.selected = index)));
        });
      };

      select(-1);
      dev.hr(-1, 5);
      Array.from({ length: 5 }).forEach((v, i) => select(i));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.displayProps(e.state);
      const data = { props };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
