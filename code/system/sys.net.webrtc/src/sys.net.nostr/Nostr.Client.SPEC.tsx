import { css, Dev } from '../test.ui';

type T = {
  notes: string[];
};
const initial: T = { notes: [] };

const REF = {
  urls: ['https://wiki.wellorder.net/post/nostr-intro/'],
};

/**
 * Links:
 *  - https://wiki.wellorder.net/post/nostr-intro/
 */

export default Dev.describe('Nostr (Protocol)', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.debug.width(500);

    REF.urls.forEach((url) => {
      console.info(`🔗 reference: ${url}`);
    });

    ctx.subject
      .backgroundColor(1)
      .size(250, null)
      .display('grid')
      .render<T>((e) => {
        const styles = {
          base: css({ padding: 15 }),
        };
        return (
          <div {...styles.base}>
            <div>{`🐷 Nostr Client`}</div>
            <div>total notes: {e.state.notes.length}</div>
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const clone = Dev.trimStringsDeep(e.state, { maxLength: 30 });
      return <Dev.Object name={'spec'} data={clone} expand={1} />;
    });

    dev.section('nostr:// (client)', (dev) => {
      dev.hr();
      dev.button('pull messages', (e) => {
        /**
         * INCOMING note from nostr.
         */
        const logNote = (note: string) => {
          e.change((d) => d.notes.push(note));
        };

        /**
         * Sample Source:
         *   https://wiki.wellorder.net/post/nostr-intro/
         */
        type T = [type: string, name: string, payload: P];
        type P = { kinds: number[]; authors: string[] };

        const send = (event: string, name: string, payload: P) => {
          const e: T = [event, name, payload];
          ws.send(JSON.stringify(e));
        };

        // connect to a relay
        var ws = new WebSocket('wss://nostr-pub.wellorder.net');

        // send a subscription request for text notes from authors with my pubkey
        ws.addEventListener('open', function (event) {
          send('REQ', 'my-sub', { kinds: [1], authors: ['35d26e4690cbe1'] });
        });

        // print out all the returned notes
        ws.addEventListener('message', function (ev) {
          /**
           * TODO 🐷
           * FIRE nostr-event through local [EventBus].
           */
          const data = JSON.parse(ev.data);
          const type = data[0];
          const isEvent = type === 'EVENT';
          const event = isEvent && {
            type,
            name: data[1],
            payload: data[2],
          };

          if (!event) return;
          const msg = event.payload.content;

          console.log('event', event);
          console.log('Note: ', msg.substring(0, 30));
          logNote(msg);
        });
      });

      dev.button('clear', (e) => {
        e.change((d) => (d.notes = []));
      });
    });
  });
});
