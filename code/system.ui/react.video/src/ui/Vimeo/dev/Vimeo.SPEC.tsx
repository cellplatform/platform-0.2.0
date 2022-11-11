import { Spec } from '../../../test.ui';
import { Vimeo } from '..';
import { rx, t, slug, Time } from '../common.mjs';

export const VIDEO = {
  'app/tubes': 499921561,
  'stock/running': 287903693, // https://vimeo.com/stock/clip-287903693-silhouette-woman-running-on-beach-waves-splashing-female-athlete-runner-exercising-sprinting-intense-workout-on-rough-ocean-seas
  'public/helvetica': 73809723,
};

export default Spec.describe('Vimeo Player', (e) => {
  let events: t.VimeoEvents;

  /**
   * Initialize
   */
  e.it('init', async (e) => {
    const id = `foo.${slug()}`;
    const bus = rx.bus<t.VimeoEvent>();
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

    ctx.render(el);
  });

  e.describe.skip('controls', (e) => {
    e.it('play', () => {
      console.log('events', events);
    });
  });
});
