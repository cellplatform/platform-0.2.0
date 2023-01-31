import { DevHeader } from './-dev/DEV.Header';
import { t, rx, Dev } from './common';

type T = {
  results?: t.TestSuiteRunResponse;
  local: {
    recordButton?: { state?: t.RecordButtonState; enabled?: boolean };
  };
};
const initial: T = { local: { recordButton: {} } };

export default Dev.describe('TestRunner', (e) => {
  const bus = rx.bus();

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return (
          <div>
            <div style={{ padding: 10 }}>
              <Dev.TestRunner.Results data={e.state.results} />
            </div>
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.header
      .border(-0.1)
      .padding(0)
      .render<T>((e) => {
        return <DevHeader bus={bus} recordButton={e.state.local.recordButton} />;
      });

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'sys.net.webrtc'} data={e.state} expand={1} />);

    const run = (label: string, module: t.SpecImport) => {
      dev.button(`run: ${label}`, async (e) => {
        const spec = (await module).default;
        const results = await spec.run();
        await e.change((d) => (d.results = results));
      });
    };

    dev.title('Test Suites');
    run('PeerNetbus', import('../logic.PeerNetbus/PeerNetbus.SPEC.mjs'));
    run('PeerEvents', import('../logic.PeerNetwork.events/PeerEvents.SPEC.mjs'));

    dev.hr();
    dev.button('clear', (e) => e.change((d) => (d.results = undefined)));
    dev.hr();

    dev.section('Record Button', (dev) => {
      dev.TODO();

      const isRecVisible = (state: T) => {
        return Boolean(state.local.recordButton);
      };

      dev.boolean((btn) =>
        btn
          .label((e) => (isRecVisible(e.state) ? 'visible' : 'hidden'))
          .value((e) => isRecVisible(e.state))
          .onClick((e) => {
            e.change((d) => {
              d.local.recordButton = e.current ? undefined : {};
            });
          }),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => 'isEnabled')
          .value((e) => Boolean(e.state.local.recordButton?.enabled ?? false))
          .onClick((e) => {
            e.change((d) => {
              if (!isRecVisible(d)) return;
              const rec = d.local.recordButton || (d.local.recordButton = {});
              rec.enabled = !e.current;
            });
          }),
      );

      dev.hr();

      const rec = (state: t.RecordButtonState) => {
        dev.button(`state: ${state}`, async (e) => {
          e.change((d) => {
            const rec = d.local.recordButton || (d.local.recordButton = {});
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
