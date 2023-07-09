import { Color, css, Dev, Icons, COLORS, Spinner } from '../test.ui';

type T = { loading?: boolean; notes: string[] };
const initial: T = { notes: [] };

const REF = {
  urls: [
    ['intro blog (simplistic cient)', 'https://wiki.wellorder.net/post/nostr-intro/'],
    ['typescreipt client-library', 'https://github.com/philcockfield/nostr-tools'],
    ['nostr relays', 'https://nostr.com/relays'],
    ['how to setup a relay', 'https://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under'],
    ['protocols:nips', 'https://github.com/nostr-protocol/nips/blob/master/01.md'],
  ],
};

/**
 *
 * TODO 🐷
 * MOVE this module to it's package: sys.net.nostr
 */

export default Dev.describe('Nostr (Protocol)', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.debug.width(400);
    REF.urls.forEach((url) => console.info(`🔗 REF ${url[0]}: ${url[1]}`));

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const notes = e.state.notes;
        const styles = {
          base: css({
            position: 'relative',
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            color: COLORS.DARK,
          }),
          title: css({
            userSelect: 'none',
            boxSizing: 'border-box',
            Padding: [8, 10],
            Flex: 'horizontal-center-spaceBetween',
            borderBottom: `solid 5px ${Color.format(-0.1)}`,
          }),
          body: {
            base: css({ position: 'relative' }),
            inner: css({ Absolute: 0, overflowY: 'auto' }),
          },
          note: {
            base: css({
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              boxSizing: 'border-box',
              Margin: [0, 20, 0, 20],
              Padding: [15, 10, 15, 10],
              borderBottom: `dashed 1px ${Color.format(-0.1)}`,
              ':last-child': { border: 'none' },
            }),
            icon: css({
              paddingRight: 15,
            }),
          },
          empty: css({
            opacity: 0.3,
            fontSize: 13,
            padding: 20,
            fontStyle: 'italic',
            display: 'grid',
            placeItems: 'center',
            userSelect: 'none',
          }),
          spinner: css({
            Absolute: [12, 0, null, 0],
            display: 'grid',
            placeItems: 'center',
          }),
        };

        const isEmpty = notes.length === 0;

        const elSpinner = e.state.loading && (
          <div {...styles.spinner}>
            <Spinner.Puff />
          </div>
        );
        const elEmpty = isEmpty && !elSpinner && (
          <div {...styles.empty}>{'Nothing to display.'}</div>
        );

        const elNotes = notes.map((note, i) => {
          return (
            <div key={i} {...styles.note.base}>
              <div {...styles.note.icon}>
                <Icons.Note.Event opacity={0.3} size={22} />
              </div>
              <div>{note}</div>
            </div>
          );
        });

        return (
          <div {...styles.base}>
            <div {...styles.title}>
              <div>{`🐷 Nostr Client`}</div>
              <div>total notes: {notes.length}</div>
            </div>
            <div {...styles.body.base}>
              <div {...styles.body.inner}>
                {elEmpty}
                {elSpinner}
                {elNotes}
              </div>
            </div>
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const clone = Dev.trimStringsDeep(e.state, { maxLength: 30 });
      return <Dev.Object name={'spec'} data={clone} expand={1} />;
    });

    dev.section('client (websocket)', (dev) => {
      dev.hr(-1, 5);
      dev.button('pull', async (e) => {
        e.change((d) => (d.loading = true));

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

        // Connect to a relay.
        var ws = new WebSocket('wss://nostr-pub.wellorder.net');
        const AUTHOR_PUBLIC_KEY = '35d26e4690cbe1';

        // Send a subscription request for text notes from authors with my pubkey
        ws.addEventListener('open', function (event) {
          send('REQ', 'my-sub', { kinds: [1], authors: [AUTHOR_PUBLIC_KEY] });
        });

        // Print out all the returned notes.
        ws.addEventListener('message', async function (ev) {
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

          await e.change((d) => (d.loading = false));

          console.log('event', event);
          console.log('Note: ', msg.substring(0, 30));
          logNote(msg);
        });
      });

      dev.button('clear', (e) => {
        e.change((d) => (d.notes = []));
      });
    });

    dev.hr(5, 20);

    dev.section('nostr-tools', async (dev) => {
      const nostr = await import('nostr-tools');

      dev.button('generate keys', (dev) => {
        let sk = nostr.generatePrivateKey(); // `sk` is a hex string
        let pk = nostr.getPublicKey(sk); //     `pk` is a hex string

        console.group('🌳 nostr keys');
        console.info(`private key (secret): ${sk}`);
        console.info(`public key: ${pk}`);
        console.groupEnd();
      });
    });
  });
});
