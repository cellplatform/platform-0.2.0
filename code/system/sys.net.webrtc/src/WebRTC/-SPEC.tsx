import { WebRTC } from '.';
import {
  Color,
  COLORS,
  css,
  Dev,
  MediaStream,
  rx,
  slug,
  t,
  TextInput,
  TextSyntax,
  Button,
  Icons,
} from '../test.ui';

type Id = string;

type T = {
  debug: {
    remote?: Id;
    testrunner: { spinning?: boolean; data?: t.TestSuiteRunResponse };
    muted: boolean;
  };
  peer?: t.Peer;
  connections: t.PeerConnection[];
};
const initial: T = {
  connections: [],
  peer: undefined,
  debug: {
    muted: location.hostname === 'localhost',
    testrunner: {},
  },
};

export default Dev.describe('WebRTC', (e) => {
  const signal = 'rtc.cellfs.com';
  let self: t.Peer;

  const bus = rx.bus();
  const media = MediaStream.Events(bus);
  const streamRef = `sample.${slug()}`;

  const getVideoStream = async () => {
    await media.stop(streamRef).fire();
    await media.start(streamRef).video();
    const { stream } = await media.status(streamRef).get();
    return stream?.media;
  };

  e.it('init:webrtc', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    /**
     * WebRTC (network)
     */
    self = await WebRTC.peer({ signal, getLocalStream: getVideoStream });
    await state.change((d) => (d.peer = self));
    self.connections$.subscribe((e) => {
      console.log('self.connections$', self.connections$);
      state.change((d) => {
        d.connections = e.connections;
        d.peer = self;
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
          footer: css({
            borderTop: `solid 1px ${Color.format(-0.2)}`,
            display: 'grid',
          }),
        };

        const code = `// 👋 Hello World!\n`;

        return (
          <div {...styles.base}>
            <Dev.TestRunner.Results {...e.state.debug.testrunner} padding={10} />
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
        const media = e.state.peer?.mediaConnections[0]; // TEMP - from selection 🐷
        const peerId = WebRTC.Util.asUri(self.id);
        const copyPeer = () => navigator.clipboard.writeText(peerId);
        const height = 250;

        const PROFILE =
          'https://user-images.githubusercontent.com/185555/206985006-18bf5e3c-b6f2-4a47-8036-9513e842797e.png';

        const styles = {
          base: css({ position: 'relative' }),
          video: {
            base: css({
              height,
              position: 'relative',
              // backgroundColor: Color.alpha(COLORS.DARK, 0.05),
              borderBottom: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,

              backgroundImage: `url(${PROFILE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }),
            bg: css({
              Absolute: 0,
              pointerEvents: 'none',
              display: 'grid',
              placeItems: 'center',
            }),
          },
          peer: css({ display: 'grid', justifyContent: 'center', padding: 5 }),
        };

        const elPeer = (
          <Button onClick={copyPeer}>
            <TextSyntax text={peerId} monospace={true} fontWeight={'bold'} fontSize={13} />
          </Button>
        );

        return (
          <div {...styles.base}>
            <div {...styles.video.base}>
              <div {...styles.video.bg}>
                <Icons.Face.Call size={80} opacity={0.2} />
                {/* <Icons.Cube size={80} opacity={0.3} /> */}
              </div>
              {media && (
                <MediaStream.Video
                  stream={media.stream.remote}
                  muted={e.state.debug.muted}
                  height={height}
                />
              )}
            </div>
            <div {...styles.peer}>{elPeer}</div>
          </div>
        );
      });

    dev.footer.border(-0.1).render<T>((e) => {
      const { peer, connections } = e.state;
      const data = { connections, peer };
      return <Dev.Object name={'spec.WebRTC'} data={data} expand={1} />;
    });

    dev.boolean((btn) =>
      btn
        .label((e) => `video: ${e.state.debug.muted ? 'muted' : 'unmuted'}`)
        .value((e) => e.state.debug.muted)
        .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'muted'))),
    );

    dev.hr();

    dev.section('Connections', (dev) => {
      dev.hr();
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.debug.remote}
            valueStyle={{ fontSize: 14 }}
            placeholder={'paste remote peer'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            focusAction={'Select'}
            spellCheck={false}
            onChanged={(e) => dev.change((d) => (d.debug.remote = e.to))}
            onEnter={async () => {
              const id = state.current.debug.remote;
              connectData(id);
              connectVideo(id);
              await dev.change((d) => (d.debug.remote = ''));
            }}
          />
        );
      });
      dev.hr();

      const isSelf = (state: T) => {
        const remote = WebRTC.Util.cleanId(state.debug.remote ?? '');
        return remote === self.id;
      };

      const canConnect = (state: T) => {
        const remote = state.debug.remote ?? '';
        return Boolean(remote) && !isSelf(state);
      };

      const connectData = async (remote: t.PeerId = '') => {
        const res = await self.data(remote);
        console.log('⚡️ peer.data (response):', res);
      };

      const connectVideo = async (remote: t.PeerId = '') => {
        await media.stop(streamRef).fire();
        await media.start(streamRef).video();
        const { stream } = await media.status(streamRef).get();
        const localStream = stream?.media;

        if (remote && localStream) {
          const res = await self.media(remote, localStream);
          console.log('⚡️ peer.media (response):', res);
        }
      };

      const connectButton = (label: string, fn: t.DevButtonClickHandler<T>) => {
        dev.button((btn) =>
          btn
            .label(`connect: ${label}`)
            .right((e) => (isSelf(e.state) ? 'self ⚠️' : ''))
            .enabled((e) => canConnect(e.state))
            .onClick(fn),
        );
      };

      connectButton('data', (e) => connectData(e.state.current.debug.remote));
      connectButton('video', (e) => connectVideo(e.state.current.debug.remote));

      dev.button((btn) =>
        btn
          .label('close all')
          .enabled((e) => Boolean(e.state.connections.length > 0))
          .onClick(async (e) => {
            self.connections.forEach((conn) => conn.dispose());
            await media.stop(streamRef).fire();
          }),
      );

      dev.hr();

      dev.row((e) => {
        const styles = {
          base: css({}),
          item: css({
            display: 'grid',
            gridTemplateColumns: '1fr auto',
          }),
        };
        return (
          <div {...styles.base}>
            {self.connections.map((conn, i) => {
              return (
                <div key={conn.id} {...styles.item}>
                  <div>{conn.kind}</div>
                  <Button onClick={conn.dispose}>close</Button>
                </div>
              );
            })}
          </div>
        );
      });
    });
    dev.hr();

    dev.section('Debug', (dev) => {
      const invoke = async (module: t.SpecImport) => {
        await dev.change((d) => (d.debug.testrunner.spinning = true));
        const spec = (await module).default;
        const results = await spec.run();
        await dev.change((d) => {
          d.debug.testrunner.data = results;
          d.debug.testrunner.spinning = false;
        });
      };

      dev.button('run: unit-tests', (e) => invoke(import('./WebRTC.SPEC.mjs')));
    });

    dev.hr();
  });
});
