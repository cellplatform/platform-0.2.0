import { Vimeo } from '..';
import { Spec } from '../../../test.ui';
import { rx, slug, t } from '../common.mjs';
import { VIDEO } from './sample.mjs';

export default Spec.describe('Vimeo Player', (e) => {
  let events: t.VimeoEvents;

  /**
   * Initialize
   */
  e.it('init', async (e) => {
    const id = `foo.${slug()}`;
    const bus = rx.bus();
    const instance = { bus, id };
    events = Vimeo.Events({ instance });

    const ctx = Spec.ctx(e);
    const elPlayer = (
      <Vimeo
        instance={instance}
        video={VIDEO['stock/running']}
        borderRadius={20}
        onIconClick={(e) => console.info(`⚡️ icon click`, e)}
      />
    );

    const el = (
      <div>
        {elPlayer}
        <div>
          <div onClick={() => events.play.fire()}>play</div>
        </div>
      </div>
    );

    ctx.component.render(() => el);
  });

  e.describe.skip('controls', (e) => {
    e.it('play', () => {
      console.log('events', events);
    });
  });
});
