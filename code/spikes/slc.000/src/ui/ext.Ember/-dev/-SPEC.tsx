import { Dev, Icons, Vimeo, rx, slug, type t } from '../../../test.ui';

import { Root } from '..';
import { Wrangle } from '../Wrangle.mjs';
import { DATA } from './-sample.data.mjs';

type T = {
  props: t.RootProps;
  debug: { withSlugs?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('Landing.Ember', (e) => {
  type LocalStore = Pick<T['debug'], 'withSlugs'> & Pick<t.RootProps, 'selected'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:landing.ember');
  const local = localstore.object({
    withSlugs: true,
    selected: -1,
  });

  const bus = rx.bus();
  const vimeo: t.VimeoInstance = { bus, id: `foo.${slug()}` };
  const player = Vimeo.Events(vimeo);

  const State = {
    displayProps(state: T): t.RootProps {
      const { debug } = state;
      const props: t.RootProps = { ...state.props, vimeo };
      if (!debug.withSlugs) delete props.slugs;
      return props;
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.selected = local.selected;
      d.props.slugs = DATA.slugs;
      d.debug.withSlugs = local.withSlugs;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const props = State.displayProps(e.state);
        return (
          <Root
            {...props}
            onSelect={(e) => {
              state.change((d) => (d.props.selected = e.index));
              local.selected = e.index;
            }}
            onPlayComplete={(e) => {
              console.info('⚡️ onPlayComplete:', e);
              const { slugs, selected } = state.current.props;
              const next = Wrangle.nextSlug(slugs, selected);
              if (next.exists) state.change((d) => (d.props.selected = next.index));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

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

    dev.hr(5, 20);

    dev.section('Video', (dev) => {
      dev.button((btn) => {
        btn
          .label('play')
          .right((e) => <Icons.Play.Sharp size={16} />)
          .onClick((e) => player.play.fire());
      });

      dev.button((btn) => {
        btn
          .label('pause')
          .right((e) => <Icons.Pause.Sharp size={16} />)
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
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.displayProps(e.state);
      const data = { props };
      return <Dev.Object name={'Landing.Ember'} data={data} expand={1} />;
    });
  });
});
