import { WebRTC } from '.';
import { Color, css, Dev, MediaStream, rx, slug, t, TextInput } from '../test.ui';

type Id = string;

type T = {
  debug: {
    remotePeer?: Id;
    testrunner: { spinning?: boolean; data?: t.TestSuiteRunResponse };
  };
  peer?: t.Peer;
  connections: t.PeerConnection[];
};
const initial: T = {
  connections: [],
  peer: undefined,
  debug: { testrunner: {} },
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
      state.change((d) => (d.connections = e.connections));
    });

    // Media (Video/Audio/Screen).
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
              <MonacoEditor language={'typescript'} text={'// hello world!'} />
            </div>
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { peer, connections } = e.state;
      const data = { connections, peer };
      return <Dev.Object name={'spec.WebRTC'} data={data} expand={1} />;
    });

    dev.button((btn) =>
      btn
        .label('copy peer-id (self)')
        .right((e) => {
          const id = self.id;
          const left = id.substring(0, 5);
          const right = id.substring(id.length - 5);
          return `("peer:${left} .. ${right}")`;
        })
        .onClick(async (e) => navigator.clipboard.writeText(`peer:${self.id}`)),
    );

    dev.hr();

    dev.row((e) => {
      return (
        <TextInput
          value={e.state.debug.remotePeer}
          valueStyle={{ fontSize: 14 }}
          placeholder={'connect to remote (peer-id)'}
          placeholderStyle={{ opacity: 0.3, italic: true }}
          focusAction={'Select'}
          spellCheck={false}
          onChanged={(e) => dev.change((d) => (d.debug.remotePeer = e.to))}
          onEnter={async () => {
            const remote = e.state.debug.remotePeer ?? '';
            const data = await self.data(remote);
            console.log('⚡️ connected:', data);
          }}
        />
      );
    });

    dev.hr();

    dev.button('🐷 tmp', async (e) => {
      await media.stop(streamRef).fire();
      await media.start(streamRef).video();
      const { stream } = await media.status(streamRef).get();

      const remotePeer = e.state.current.debug.remotePeer ?? '';
      const localStream = stream?.media;

      console.log('remotePeer', remotePeer);
      console.log('local stream', stream);

      if (remotePeer && localStream) {
        const res = await self.media(remotePeer, localStream);
        console.log('res', res);
      }
    });

    dev.button('kill all connections', (e) => {
      self.connections.forEach((conn) => conn.dispose());
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
  });
});
