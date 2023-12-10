import { css, Dev, type t } from '../../test.ui';

type T = {};
const initial: T = {};

/**
 * Spec
 * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
 *
 * - stun:stun.l.google.com:19302
 * - turn:eu-0.turn.peerjs.com:3478
 * - turn:us-0.turn.peerjs.com:3478
 *   - credential: "peerjsp" / username: "peerjs"
 */
const name = 'sample.01';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();

    dev.button('tmp', (e) => {
      const config = {
        iceServers: [{ urls: 'stun:stun.mystunserver.tld' }],
      };
      const pc = new RTCPeerConnection(config);
      console.log('pc', pc);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
