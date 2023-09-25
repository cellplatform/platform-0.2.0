import { css, Dev, type t, cuid, ObjectView, Icons, Button } from '../../test.ui';
import { Peer } from 'peerjs';

type T = { peerid: string };
const initial: T = { peerid: '' };

/**
 * Spec
 * - https://peerjs.com
 * - https://github.com/peers/peerjs
 */
const name = 'Sample';

export default Dev.describe(name, (e) => {
  let peer: Peer;
  const initPeer = (state: t.DevCtxState<T>, peerid: string) => {
    state.change((d) => (d.peerid = peerid));
    local.peerid = peerid;
    peer = new Peer(peerid);
    return peer;
  };

  type LocalStore = { peerid: string };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs');
  const local = localstore.object({
    peerid: cuid(),
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.peerid = local.peerid;
    });

    initPeer(state, state.current.peerid);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([450, null])
      .display('grid')
      .render<T>((e) => {
        const styles = {
          base: css({ padding: 15, overflow: 'hidden' }),
        };
        return (
          <div {...styles.base}>
            <ObjectView name={'ext.lib.peerjs'} data={{ peer }} expand={2} />
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.textbox((txt) => {
      txt
        .label((e) => 'peerid')
        .value((e) => e.state.peerid)
        .right((e) => (
          <Button onClick={() => initPeer(state, cuid())}>
            <Icons.Refresh size={16} />
          </Button>
        ))
        .onChange((e) => e.change((d) => (d.peerid = e.to.value)))
        .onEnter((e) => initPeer(state, state.current.peerid));
    });

    // dev.button((btn) => {
    //   btn.label(``).right((e) => `←`).enabled((e) => true).onClick((e) => {})
    // });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { ...e.state };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
