import { DevHeader } from './-dev/DEV.ui.Header';
import { TEST, PeerNetwork } from '.';
import { TextInput, t, rx, Dev, css } from './common';

type T = {
  testrunner: { spinning?: boolean; data?: t.TestSuiteRunResponse };
  debug: {
    remotePeer?: t.PeerId;
    recordButton?: { state?: t.RecordButtonState; enabled?: boolean };
  };
  status?: t.PeerStatus;
};
const initial: T = {
  testrunner: {},
  debug: { recordButton: {} },
};

export default Dev.describe('TestRunner', (e) => {
  const bus = rx.bus();
  const signal = TEST.signal;
  const timeout = 1000 * 15;

  let network: t.PeerNetwork;
  let self = '';

  e.timeout(timeout);

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    const started = await PeerNetwork.start({ bus, signal, timeout });
    network = started.network;
    self = network.self;

    network.events.peer.data(self).in$.subscribe((e) => {
      console.log('data', e);
    });

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return (
          <Dev.TestRunner.Results {...e.state.testrunner} padding={10} style={{ Absolute: 0 }} />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.header
      .border(-0.1)
      .padding(0)
      .render<T>((e) => {
        return <DevHeader bus={bus} recordButton={e.state.debug.recordButton} />;
      });

    dev.footer
      .border(-0.1)
      .render<T>((e) => (
        <Dev.Object
          name={'sys.net.webrtc'}
          data={e.state}
          expand={{ level: 1, paths: ['$.status'] }}
        />
      ));

    dev.section('Test Suites', (dev) => {
      const run = (label: string, module: t.SpecImport) => {
        dev.button(`run: ${label}`, async (e) => {
          await e.change((d) => (d.testrunner.spinning = true));
          const spec = (await module).default;
          const results = await spec.run();
          await e.change((d) => {
            d.testrunner.data = results;
            d.testrunner.spinning = false;
          });
        });
      };

      run('PeerNetbus', import('../web.PeerNetbus/-SPEC.mjs'));
      run('PeerEvents', import('../web.PeerNetwork.events/-SPEC.mjs'));
      run('PeerStrategy', import('../web.PeerNetwork/strategy/PeerStrategy/-SPEC.mjs'));
      run('PeerNetwork', import('../web.PeerNetwork/-SPEC.mjs'));
    });

    dev.hr();
    dev.button('clear', (e) => e.change((d) => (d.testrunner.data = undefined)));

    dev.hr();
    dev.section('Network', (dev) => {
      dev.button('copy local peer (id)', async (e) => {
        const peer = `peer:${self}`;
        await navigator.clipboard.writeText(peer);
      });

      dev.button('⚡️ read status', async (e) => {
        const res = await network.events.peer.status(self).get();
        e.change((d) => (d.status = res.peer));
      });

      dev.hr();

      dev.row((e) => {
        const styles = {
          base: css({}),
        };

        return (
          <div {...styles.base}>
            <TextInput
              value={e.state.debug.remotePeer}
              placeholder={'remote peer (id)'}
              placeholderStyle={{ opacity: 0.3, italic: true }}
              valueStyle={{ fontSize: 14 }}
              spellCheck={false}
              onChanged={(e) => dev.change((d) => (d.debug.remotePeer = e.to))}
              onEnter={async () => {
                const remote = e.state.debug.remotePeer ?? '';
                const connector = network.events.peer.connection(self, remote);
                const res = await connector.open.data({ isReliable: true });
                console.log('data connection:', res);
              }}
            />
          </div>
        );
      });

      dev.hr();
      dev.title('Remote');
      dev.button('send data', (e) => {
        const msg = `message from [peer:${self}]`;
        network.netbus.target.remote({ type: 'foo', payload: { msg } });
      });
    });

    dev.hr();
    dev.section('Record Button', (dev) => {
      dev.TODO();

      const isRecVisible = (state: T) => {
        return Boolean(state.debug.recordButton);
      };

      dev.boolean((btn) =>
        btn
          .label((e) => (isRecVisible(e.state) ? 'visible' : 'hidden'))
          .value((e) => isRecVisible(e.state))
          .onClick((e) => {
            e.change((d) => {
              d.debug.recordButton = e.current ? undefined : {};
            });
          }),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => 'isEnabled')
          .value((e) => Boolean(e.state.debug.recordButton?.enabled ?? false))
          .onClick((e) => {
            e.change((d) => {
              if (!isRecVisible(d)) return;
              const rec = d.debug.recordButton || (d.debug.recordButton = {});
              rec.enabled = !e.current;
            });
          }),
      );

      dev.hr();

      const rec = (state: t.RecordButtonState) => {
        dev.button(`state: ${state}`, async (e) => {
          e.change((d) => {
            const rec = d.debug.recordButton || (d.debug.recordButton = {});
            rec.enabled = true;
            rec.state = state;
          });
        });
      };
      rec('default');
      rec('recording');
      rec('paused');
    });
  });
});
