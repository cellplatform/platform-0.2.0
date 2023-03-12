import { Vimeo } from '..';
import { Dev } from '../../../test.ui';
import { rx, slug, t } from '../common.mjs';
import { VIDEO } from './SAMPLES.mjs';

const initial = { count: 0 };
type S = typeof initial;

export default Dev.describe('Vimeo Player', (e) => {
  let events: t.VimeoEvents;

  /**
   * Initialize
   */
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);

    const bus = rx.bus();
    const instance = { bus, id: `foo.${slug()}` };
    events = Vimeo.Events({ instance });

    ctx.subject.render(() => {
      return (
        <Vimeo
          instance={instance}
          video={VIDEO['stock/running']}
          borderRadius={20}
          onIconClick={(e) => console.info(`⚡️ icon click`, e)}
        />
      );
    });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<S>(e, initial);
    dev
      .button((btn) => btn.label('Play').onClick((e) => events.play.fire()))
      .button((btn) => btn.label('Pause').onClick((e) => events.pause.fire()))
      .hr();
  });
});
