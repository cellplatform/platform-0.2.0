import { WebRTC } from '.';
import { Color, css, Dev, MediaStream, rx, slug, t, TextInput } from '../test.ui';

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

    // WebRTC (Peer)
    self = await WebRTC.peer({ signal, getLocalStream: getVideoStream });
    await state.change((d) => (d.peer = self));
    self.connections$.subscribe((e) => {
      console.log('self.connections$', self.connections$);
      state.change((d) => {
        d.connections = e.connections;
        d.peer = self;
      });
    });

    // Media (video/audio/screen).
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

        return (
          <div {...styles.base}>
            <Dev.TestRunner.Results {...e.state.debug.testrunner} padding={10} />
            <div {...styles.footer}>
              <MonacoEditor language={'typescript'} text={'// 👋 Hello World!'} />
            </div>
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.header
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        const media = e.state.peer?.mediaConnections[0]; // TEMP 🐷
        if (!media) return null;
        return (
          <MediaStream.Video
            stream={media.stream.remote}
            muted={e.state.debug.muted}
            height={250}
          />
        );
      });

    dev.footer.border(-0.1).render<T>((e) => {
      const { peer, connections } = e.state;
      const data = { connections, peer };
      return <Dev.Object name={'spec.WebRTC'} data={data} expand={1} />;
    });

    dev.boolean((btn) =>
      btn
        .label('video.muted')
        .value((e) => e.state.debug.muted)
        .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'muted'))),
    );

    dev.button((btn) =>
      btn
        .label('copy id (self)')
        .right((e) => {
          const id = self.id;
          const left = id.substring(0, 5);
          const right = id.substring(id.length - 5);
          return `("peer:${left} .. ${right}")`;
        })
        .onClick(async (e) => navigator.clipboard.writeText(`peer:${self.id}`)),
    );

    dev.hr();

    dev.section('Connections', (dev) => {
      dev.hr();
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.debug.remote}
            valueStyle={{ fontSize: 14 }}
            placeholder={'remote peer-id'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            focusAction={'Select'}
            spellCheck={false}
            onChanged={(e) => dev.change((d) => (d.debug.remote = e.to))}
          />
        );
      });
      dev.hr();

      const connect = (label: string, fn: t.DevButtonClickHandler<T>) => {
        dev.button((btn) =>
          btn
            .label(`connect: ${label}`)
            .enabled((e) => Boolean(e.state.debug.remote))
            .onClick(fn),
        );
      };

      connect('data', async (e) => {
        const remote = e.state.current.debug.remote ?? '';
        const res = await self.data(remote);
        console.log('⚡️ peer.data (response):', res);
      });

      connect('video', async (e) => {
        await media.stop(streamRef).fire();
        await media.start(streamRef).video();
        const { stream } = await media.status(streamRef).get();

        const remote = e.state.current.debug.remote ?? '';
        const localStream = stream?.media;

        if (remote && localStream) {
          const res = await self.media(remote, localStream);
          console.log('⚡️ peer.media (response):', res);
        }
      });

      dev.button((btn) =>
        btn
          .label('close all')
          .enabled((e) => Boolean(e.state.connections.length > 0))
          .onClick((e) => self.connections.forEach((conn) => conn.dispose())),
      );
    });
    dev.hr();

    dev.section('Test Suites', (dev) => {
      const invoke = async (module: t.SpecImport) => {
        await dev.change((d) => (d.debug.testrunner.spinning = true));
        const spec = (await module).default;
        const results = await spec.run();
        await dev.change((d) => {
          d.debug.testrunner.data = results;
          d.debug.testrunner.spinning = false;
        });
      };

      const run = (label: string, module: t.SpecImport, immediate?: boolean) => {
        dev.button(`run: ${label}`, (e) => invoke(module));
        if (immediate) invoke(module);
      };

      run('WebRTC (spec)', import('./WebRTC.SPEC.mjs'), false);
    });
    dev.hr();
  });
});
