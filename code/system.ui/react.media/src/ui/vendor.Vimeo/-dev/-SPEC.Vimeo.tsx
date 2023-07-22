import { Dev } from '../../../test.ui';

import { VimeoPlayer } from '..';
import { rx, slug, type t } from '../common';
import { VIDEO } from './-Sample.mjs';

type T = {
  props: t.VimeoPlayerProps;
  debug: { video?: string };
};
const initial: T = {
  props: { borderRadius: 20 },
  debug: {},
};

export default Dev.describe('Vimeo Player', (e) => {
  const bus = rx.bus();
  const instance = { bus, id: `foo.${slug()}` };
  const events = VimeoPlayer.Events({ instance });

  type LocalStore = Pick<t.VimeoPlayerProps, 'video'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.media.Vimeo');
  const local = localstore.object({
    video: VIDEO['stock/running'],
  });

  /**
   * Initialize
   */
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.video = local.video;
    });

    ctx.subject.render<T>((e) => {
      return (
        <VimeoPlayer
          {...e.state.props}
          instance={instance}
          onIconClick={(e) => console.info(`⚡️ icon click`, e)}
        />
      );
    });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Controls', (dev) => {
      dev
        .button((btn) => btn.label('play').onClick((e) => events.play.fire()))
        .button((btn) => btn.label('pause').onClick((e) => events.pause.fire()));
    });

    dev.hr(5, 20);

    dev.section((dev) => {
      dev.textbox((txt) => {
        const value = (state: T) => state.props.video;
        txt
          .margin([0, 0, 20, 0])
          .label((e) => 'vimeo id')
          .placeholder('number')
          .value((e) => e.state.debug.video ?? value(e.state)?.toString())
          .onChange((e) => e.change((d) => (d.debug.video = e.to.value)))
          .onEnter((e) => {
            e.change((d) => {
              const next = d.debug.video ? parseInt(d.debug.video) : undefined;
              d.props.video = next;
              d.debug.video = undefined;
              local.video = next;
            });
          });
      });

      const video = (label: string, id: t.VimeoId) => {
        const current = (state: T) => state.props.video;
        dev.button((btn) => {
          btn
            .label(label)
            .right((e) => (current(e.state) === id ? `←` : ''))
            .onClick((e) => e.change((d) => (local.video = d.props.video = id)));
        });
      };

      Object.entries(VIDEO).forEach(([key, id]) => video(key, id));
    });
  });
});
