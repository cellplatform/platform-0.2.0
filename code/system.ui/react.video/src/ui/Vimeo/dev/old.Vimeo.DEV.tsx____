import React from 'react';
import { DevActions, ActionHandlerArgs } from 'sys.ui.dev';

import { Vimeo, VimeoProps } from '..';
import { rx, t, COLORS, value, IconFlags } from '../common';
import { useIconController } from '../hooks';

export const VIDEO = {
  'app/tubes': 499921561,
  'stock/running': 287903693, // https://vimeo.com/stock/clip-287903693-silhouette-woman-running-on-beach-waves-splashing-female-athlete-runner-exercising-sprinting-intense-workout-on-rough-ocean-seas
  'public/helvetica': 73809723,
};

export const VIDEOS = Object.keys(VIDEO).map((label) => ({ label, value: VIDEO[label] }));

const THUMBNAIL = 'https://source.unsplash.com/ntqaFfrDdEA/1920x1280';

type Ctx = {
  theme: 'light' | 'dark';
  bus: t.EventBus<t.VimeoEvent>;
  events: t.VimeoEvents;
  props: VimeoProps;
  debug: { timestamp: React.ReactNode; useIconController: boolean };
};
type A = ActionHandlerArgs<Ctx>;

export const actions = DevActions<Ctx>()
  .namespace('ui.video.Vimeo')
  .context((e) => {
    if (e.prev) return e.prev;

    const id = 'sample';
    const bus = rx.bus<t.VimeoEvent>();
    const instance = { bus, id };
    const events = Vimeo.Events({ instance });

    events.$.pipe().subscribe((e) => {
      // console.log('events.$:', e.type, e.payload);
    });

    events.status.$.subscribe((event) => {
      // console.log('Vimeo/status:', event);
      e.change.ctx((ctx) => {
        const seconds = value.round(event.seconds, 1);
        const duration = value.round(event.duration, 0);
        ctx.debug.timestamp = `${seconds}/${duration}s`;
      });
    });

    const ctx: Ctx = {
      bus,
      events,
      theme: 'light',
      props: {
        instance,
        video: VIDEO['stock/running'],
        muted: true,
        borderRadius: 20,
        thumbnail: THUMBNAIL,
        onIconClick: (e) => console.log('onIconClick', e),
      },
      debug: {
        timestamp: '',
        useIconController: true,
      },
    };

    return ctx;
  })

  .items((e) => {
    e.title('options (reload)');
    e.button('width: 600', (e) => (e.ctx.props.width = 600));
    e.button('width: 800', (e) => (e.ctx.props.width = 800));
    e.hr(1, 0.1);
  })

  .items((e) => {
    e.title('theme');
    e.button('light', (e) => (e.ctx.theme = 'light'));
    e.button('dark', (e) => (e.ctx.theme = 'dark'));
    e.hr(1, 0.1);
  })

  .items((e) => {
    e.title('props');

    e.boolean('borderRadius', (e) => {
      if (e.changing) e.ctx.props.borderRadius = e.changing.next ? 20 : undefined;
      e.boolean.current = e.ctx.props.borderRadius !== undefined;
    });

    e.boolean('muted', (e) => {
      if (e.changing) e.ctx.props.muted = e.changing.next;
      e.boolean.current = e.ctx.props.muted;
    });

    e.boolean('thumbnail', (e) => {
      if (e.changing) e.ctx.props.thumbnail = e.changing.next ? THUMBNAIL : undefined;
      e.boolean.current = Boolean(e.ctx.props.thumbnail);
    });

    e.hr(1, 0.1);

    e.boolean('useIconController', (e) => {
      if (e.changing) e.ctx.debug.useIconController = e.changing.next;
      e.boolean.current = e.ctx.debug.useIconController;
    });

    e.select((config) => {
      config
        .items(IconFlags)
        .initial(undefined)
        .view('buttons')
        .clearable(true)
        .pipe((e) => {
          const current = e.select.current[0]; // NB: always first.
          e.select.label = current ? `icon: ${current.label}` : `icon: <undefined>`;
          e.ctx.props.icon = current ? current.value : undefined;

          e.select.description =
            e.changing && e.ctx.debug.useIconController
              ? 'HINT: Turn off "useIconController" to see effect'
              : undefined;
        });
    });

    e.hr(1, 0.1);

    e.select((config) => {
      config
        .items(VIDEOS)
        .initial(config.ctx.props.video)
        .pipe((e) => {
          const current = e.select.current[0]; // NB: always first.
          e.select.label = current ? `video: ${current.label}` : `video`;
          e.select.isPlaceholder = !Boolean(current);
          e.ctx.props.video = current ? current.value : undefined;
        });
    });

    e.textbox((config) =>
      config.placeholder('vimeo id (number)').pipe(async (e) => {
        if (e.changing?.action === 'invoke') {
          const videoId = Number.parseInt(e.changing.next);
          if (!Number.isNaN(videoId)) e.ctx.props.video = videoId;
        }
      }),
    );

    e.button('load (via event)', async (e) => {
      const videoId = 73809723;
      const { muted } = e.ctx.props;
      const res = await e.ctx.events.load.fire(videoId, { muted });
      console.log('response', res);
    });

    e.hr();
  })

  .items((e) => {
    e.title('player');

    e.button('play ("start")', (e) => e.ctx.events.play.fire());
    e.button('pause ("stop")', (e) => e.ctx.events.pause.fire());

    e.hr();
  })

  .items((e) => {
    const fire = (e: A, seconds: number) => {
      const id = e.ctx.props.instance.id;
      e.ctx.bus.fire({ type: 'Vimeo/seek:req', payload: { instance: id, seconds } });
    };

    e.title('seek (seconds)');
    e.button('0 (start)', (e) => fire(e, -10));
    e.button('15', (e) => fire(e, 15));
    e.button('20', (e) => fire(e, 20));
    e.button((config) =>
      config
        .label('999 (end)')
        .description('NB: Overshoots total frames')
        .pipe((e) => fire(e, 999)),
    );
    e.hr();
  })

  /**
   * Render
   */
  .subject((e) => {
    const { props, theme, debug } = e.ctx;

    const label = {
      topLeft: '<Vimeo>',
      topRight: debug.timestamp,
    };
    const size = { width: props.width, height: props.height };

    e.settings(
      theme === 'light'
        ? {
            layout: { label, cropmarks: -0.2, ...size },
            host: { background: -0.04 },
          }
        : {
            layout: { label, labelColor: 0.6, cropmarks: 0.4, ...size },
            host: { background: COLORS.DARK },
          },
    );

    e.render(<Sample ctx={e.ctx} />);
  });

export type SampleProps = { ctx: Ctx };

export const Sample: React.FC<SampleProps> = (props) => {
  const { ctx } = props;
  const { instance } = ctx.props;

  const icon = useIconController({ instance, isEnabled: ctx.debug.useIconController });

  return <Vimeo {...ctx.props} icon={icon.current ?? props.ctx.props.icon} />;
};

/**
 * Export
 */
export default actions;
