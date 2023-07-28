import { PlayBar } from '.';
import { Color, Dev, Vimeo, css, rx, slug, type t } from '../../test.ui';

const DEFAULTS = PlayBar.DEFAULTS;

type T = {
  props: t.PlayBarProps;
  debug: { devBg?: boolean; withSlug?: boolean; download?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('PlayBar', (e) => {
  /**
   * LocalStorage
   */
  type LocalStore = Pick<T['debug'], 'withSlug' | 'download' | 'devBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.PlayBar');
  const local = localstore.object({
    withSlug: true,
    download: true,
    devBg: true,
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
    props(state: T): t.PlayBarProps {
      const { props, debug } = state;

      const url = 'https://slc-1dot1ggiz.vercel.app/static/pdf/slc.pdf';
      const download: t.DownloadFileProps = { kind: 'pdf', url, filename: 'slc.pdf' };
      return {
        ...props,
        vimeo,
        slug: debug.withSlug ? props.slug : undefined,
        download: debug.download ? download : undefined,
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
      d.debug.download = local.download;
      d.debug.devBg = local.devBg;
    });

    ctx.debug.width(330);
    ctx.subject
      .size([600, null])
      .display('grid')
      .render<T>((e) => {
        const props = State.props(e.state);
        ctx.subject.backgroundColor(e.state.debug.devBg ? 1 : 0);
        const padding = e.state.debug.devBg ? 10 : 0;
        return (
          <PlayBar
            {...props}
            style={{ padding }}
            onPlayComplete={(e) => {
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
          base: css({ borderRadius, backgroundColor: Color.format(-0.04) }),
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

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.download);
        btn
          .label((e) => `download`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.download = Dev.toggle(d.debug, 'download'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.withSlug);
        btn
          .label((e) => (value(e.state) ? `with slug (data)` : 'without slug (undefined)'))
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.withSlug = Dev.toggle(d.debug, 'withSlug'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.devBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.devBg = Dev.toggle(d.debug, 'devBg'))));
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
      return <Dev.Object name={'PlayBar'} data={data} expand={1} />;
    });
  });
});
