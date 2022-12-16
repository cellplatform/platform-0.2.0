import { VimeoBackground } from '..';
import { Spec } from '../../../test.ui';
import { rx, slug, t } from '../common.mjs';
import { VIDEO } from './sample.mjs';

export default Spec.describe('VimeoBackground Player', (e) => {
  let events: t.VimeoEvents;

  /**
   * Initialize
   */
  e.it('init', async (e) => {
    const id = `foo.${slug()}`;
    const bus = rx.bus<t.VimeoEvent>();
    const instance = { bus, id };
    events = VimeoBackground.Events({ instance });

    const ctx = Spec.ctx(e);
    const el = (
      <VimeoBackground
        instance={instance}
        video={VIDEO['app/tubes']}
        opacity={1}
        opacityTransition={300}
        blur={0}
      />
    );

    ctx.component.size(800, 600).render(() => el);
  });

  e.describe.skip('controls', (e) => {
    e.it('play', () => {
      console.log('events', events);
    });
  });
});
