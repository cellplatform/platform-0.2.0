import { ConceptPlayer } from '..';
import { Dev, css, rx, slug, type t, Icons } from '../../../test.ui';

import { Vimeo } from '../common';

const DEFAULTS = ConceptPlayer.DEFAULTS;
const SAMPLE_VIDEO = 499921561; // vimeo/tubes

type T = { props: t.ConceptPlayerProps };
const initial: T = { props: {} };

export default Dev.describe('ConceptPlayer', (e) => {
  type LocalStore = { videoPos?: t.Pos };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.ConceptPlayer');
  const local = localstore.object({
    videoPos: DEFAULTS.pos,
  });

  const bus = rx.bus();
  const instance = { bus, id: `foo.${slug()}` };
  const events = Vimeo.Events({ instance });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.video = {
        id: SAMPLE_VIDEO,
        pos: local.videoPos,
      };
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <ConceptPlayer {...e.state.props} vimeo={instance} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <div {...css({ display: 'grid', placeItems: 'center' })}>
          <ConceptPlayer.PositionSelector
            selected={e.state.props.video?.pos}
            onSelect={(e) => {
              state.change((d) => {
                const video = d.props.video ?? (d.props.video = {});
                video.pos = local.videoPos = e.pos;
              });
            }}
          />
        </div>
      );
    });

    dev.hr(5, 20);

    dev.section('Video', (dev) => {
      dev.button((btn) => {
        btn
          .label('play')
          .right((e) => <Icons.Play.Sharp size={16} />)
          .onClick((e) => events.play.fire());
      });

      dev.button((btn) => {
        btn
          .label('pause')
          .right((e) => <Icons.Pause.Sharp size={16} />)
          .onClick((e) => events.pause.fire());
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        btn
          .label('restart')
          .right((e) => <Icons.Replay size={16} />)
          .onClick((e) => {
            events.seek.start();
            events.play.fire();
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'ConceptSlug'} data={data} expand={1} />;
    });
  });
});
