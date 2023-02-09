import { WebRTC } from '.';
import { Color, COLORS, css, Dev, MediaStream, rx, slug, t, TEST, TextInput } from '../test.ui';
import { PeerList } from './-dev/ui.PeerList';
import { PeerVideo } from './-dev/ui.PeerVideo';

type Id = string;

type T = {
  debug: {
    remotePeer?: Id;
    testrunner: { spinning?: boolean; data?: t.TestSuiteRunResponse };
    muted: boolean;
  };
  self?: t.Peer;
  connections: t.PeerConnection[];
};
const initial: T = {
  connections: [],
  self: undefined,
  debug: {
    remotePeer: '',
    muted: location.hostname === 'localhost',
    testrunner: {},
  },
};

export default Dev.describe('WebRTC', (e) => {
  const signal = TEST.signal;
  let self: t.Peer;

  const bus = rx.bus();
  const media = MediaStream.Events(bus);
  const streamRef = `sample.${slug()}`;

  e.it('init:webrtc', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const { getStream } = WebRTC.Media.singleton();

    /**
     * WebRTC (network)
     */
    self = await WebRTC.peer({ signal, getStream });
    await state.change((d) => (d.self = self));
    self.connections$.subscribe((e) => {
      state.change((d) => {
        d.connections = e.connections;
        d.self = self;
      });
    });

    /**
     * Media (video/audio/screen)
     */
    MediaStream.Controller({ bus });
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .backgroundColor(1)
      .size('fill')
      .render<T>(async (e) => {
        const { MonacoEditor } = await import('sys.ui.react.monaco');
        const styles = {
          base: css({ display: 'grid', gridTemplateRows: '2fr 1fr' }),
          footer: css({ borderTop: `solid 1px ${Color.format(-0.2)}`, display: 'grid' }),
        };

        const code = `
/**
 * system.network.webrtc
 * 
 * Peer-to-peer network tooling
 * (realtime network streams: data/video/audio realtime).
 * 
 * Runtime:  browser
 * Standard: https://www.w3.org/TR/webrtc/
 * 
 * Concepts: 
 *  - Distributed EventBus
 *  - Stream types: Data/Media
 */        
`.substring(1);

        return (
          <div {...styles.base}>
            <Dev.TestRunner.Results {...e.state.debug.testrunner} padding={10} scroll={true} />
            <div {...styles.footer}>
              <MonacoEditor language={'typescript'} text={code} />
            </div>
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state<T>(initial);

    dev.header
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        return <PeerVideo self={self} mediaHeight={250} muted={e.state.debug.muted} />;
      });

    dev.footer.border(-0.1).render<T>((e) => {
      const { self, connections } = e.state;
      const data = { self, connections };
      return <Dev.Object name={'spec.WebRTC'} data={data} expand={1} />;
    });

    dev.boolean((btn) =>
      btn
        .label((e) => `${e.state.debug.muted ? 'muted' : 'unmuted'}`)
        .value((e) => e.state.debug.muted)
        .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'muted'))),
    );

    dev.section((dev) => {
      dev.hr();
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.debug.remotePeer}
            valueStyle={{ fontSize: 14 }}
            placeholder={'paste remote peer'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            focusAction={'Select'}
            spellCheck={false}
            onChanged={(e) => dev.change((d) => (d.debug.remotePeer = e.to))}
            onEnter={async () => {
              const id = state.current.debug.remotePeer;
              connectData(id);
              connectCamera(id);
              // await dev.change((d) => (d.debug.remotePeer = ''));
            }}
          />
        );
      });
      dev.hr();

      const isSelf = (state: T) => {
        const remote = WebRTC.Util.asId(state.debug.remotePeer ?? '');
        return remote === self.id;
      };

      const canConnect = (state: T) => {
        const remote = state.debug.remotePeer ?? '';
        return Boolean(remote) && !isSelf(state);
      };

      const connectData = async (remote: t.PeerId = '') => {
        const res = await self.data(remote);
        console.log('⚡️ peer.data (response):', res);
      };

      const connectCamera = async (remote: t.PeerId = '') => {
        const res = await self.media(remote, 'camera');
        console.log('⚡️ peer.media (response):', res);
      };

      const connectScreenshare = async (remote: t.PeerId = '') => {
        /**
         * TODO 🐷 - connect screen share
         * - [ ] recieve event notification from Peer display list.
         * - [ ] Update WebRTC.media(<target>, { type: 'screenshare' })
         */
        console.log('🐷 TODO: connect screen share');
      };

      dev.row((e) => {
        const totalPeers = self.connectionsByPeer.length;
        if (totalPeers === 0) return;

        const styles = {
          base: css({
            position: 'relative',
            marginTop: 10,
          }),
          list: css({ marginLeft: 20, marginRight: 10 }),
          hrBottom: css({
            borderBottom: `solid 5px ${Color.alpha(COLORS.DARK, 0.1)}`,
            marginTop: 30,
            marginBottom: 20,
          }),
        };

        return (
          <div {...styles.base}>
            <PeerList
              peer={self}
              style={styles.list}
              onConnectRequest={(ev) => {
                /**
                 * TODO 🐷 - ADD Connection
                 */
                console.log('e', e);
                const remotePeer = state.current.debug.remotePeer;

                /**
                 * TODO 🐷 connect to requested "kind of" connection
                 */
                // connectScreenshare(remotePeer);
                connectData(remotePeer);
              }}
            />
            <div {...styles.hrBottom} />
          </div>
        );
      });

      dev.section((dev) => {
        const connectButton = (label: string, fn: t.DevButtonClickHandler<T>) => {
          dev.button((btn) =>
            btn
              .label(`connect: ${label}`)
              .right((e) => (isSelf(e.state) ? 'self ⚠️' : ''))
              .enabled((e) => canConnect(e.state))
              .onClick(fn),
          );
        };

        connectButton('data', (e) => connectData(e.state.current.debug.remotePeer));
        connectButton('camera', (e) => connectCamera(e.state.current.debug.remotePeer));
        connectButton('screen', (e) => connectScreenshare(e.state.current.debug.remotePeer));
        dev.button((btn) =>
          btn
            .label('close all')
            // .enabled((e) => Boolean(e.state.connections.length > 0))
            .onClick(async (e) => {
              self.connections.forEach((conn) => conn.dispose());
              await media.stop(streamRef).fire();
            }),
        );
      });

      dev.hr();
    });

    dev.section('Health Check', (dev) => {
      const invoke = async (module: t.SpecImport) => {
        await dev.change((d) => (d.debug.testrunner.spinning = true));
        const spec = (await module).default;
        const results = await spec.run();
        await dev.change((d) => {
          d.debug.testrunner.data = results;
          d.debug.testrunner.spinning = false;
        });
      };

      dev.button('test WebRTC', (e) => invoke(import('./WebRTC-TEST.mjs')));
      dev.button('test MediaStream', (e) => invoke(import('../WebRTC.Media/Media-TEST.mjs')));
    });

    dev.hr();
  });
});
