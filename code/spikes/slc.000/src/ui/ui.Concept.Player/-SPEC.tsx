import { css, Color, COLORS, slug, Dev, type t, Vimeo, rx } from '../../test.ui';
import { ConceptPlayer } from '.';

const DEFAULTS = ConceptPlayer.DEFAULTS;

type T = {
  props: t.ConceptPlayerProps;
  debug: { withSlug?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('ConceptPlayer', (e) => {
  /**
   * LocalStorage
   */
  type LocalStore = Pick<T['debug'], 'withSlug'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.ConceptPlayer');
  const local = localstore.object({
    withSlug: true,
  });

  /**
   * Video
   */
  const bus = rx.bus();
  const vimeo: t.VimeoInstance = { bus, id: `foo.${slug()}` };

  /**
   * State
   */
  const State = {
    props(state: T): t.ConceptPlayerProps {
      const { props, debug } = state;
      return {
        ...props,
        vimeo,
        slug: debug.withSlug ? props.slug : undefined,
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.slug = DEFAULTS.sample;
      d.debug.withSlug = local.withSlug;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([600, null])
      .display('grid')
      .render<T>((e) => {
        const props = State.props(e.state);
        return (
          <ConceptPlayer
            {...props}
            onComplete={(e) => {
              console.info('⚡️ onComplete:', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Video', (dev) => {
      dev.row((e) => {
        const borderRadius = 10;
        const styles = {
          base: css({
            borderRadius,
            backgroundColor: Color.format(-0.04),
          }),
        };
        return (
          <div {...styles.base}>
            <Vimeo.Player
              width={300}
              borderRadius={borderRadius}
              instance={vimeo}
              video={DEFAULTS.sample.video?.id}
            />
          </div>
        );
      });
    });

    dev.hr(5, [50, 20]);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.withSlug);
        btn
          .label((e) => (value(e.state) ? `with slug (data)` : 'without slug (undefined)'))
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.withSlug = Dev.toggle(d.debug, 'withSlug'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.props(e.state);
      const data = {
        props,
        'props:slug': props.slug,
      };
      return <Dev.Object name={'ConceptPlayer'} data={data} expand={1} />;
    });
  });
});
