import { Time, css, t, Dev, TextInput } from '../test.ui';
import { WebRTC } from '.';
import { cuid, slug } from './common';

type Id = string;

type T = {
  testrunner: { spinning?: boolean; data?: t.TestSuiteRunResponse };
  debug: { remotePeer?: Id };
  'peer(self)'?: t.Peer;
};
const initial: T = { testrunner: {}, debug: {} };

export default Dev.describe('WebRTC', (e) => {
  const host = 'https://rtc.cellfs.com';
  let self: t.Peer;

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    const id = cuid();
    self = await WebRTC.peer(host, { id });
    await state.change((d) => (d['peer(self)'] = self));

    self.connections$.subscribe((e) => {
      //
      console.log('self.connections$', e);
    });

    ctx.subject
      .display('grid')
      .backgroundColor(1)
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
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec.WebRTC'} data={e.state} expand={1} />);

    dev.button((btn) =>
      btn
        .label('copy peer-id (self)')
        .right((e) => {
          const id = self.id;
          const left = id.substring(0, 5);
          const right = id.substring(id.length - 5);
          return `("${left} .. ${right}")`;
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
            console.log('connected:', data);
            // await dev.change((d) => (d.connections.data = data));
          }}
        />
      );
    });

    dev.hr();

    dev.button('tmp', async (e) => {
      const peer1 = await WebRTC.peer(host);
      const peer2 = await WebRTC.peer(host);

      await Time.wait(500);
      const res = await peer1.data(peer2.id);

      console.log('res', res);
    });

    dev.hr();

    dev.section('Test Suites', (dev) => {
      const invoke = async (module: t.SpecImport) => {
        await dev.change((d) => (d.testrunner.spinning = true));
        const spec = (await module).default;
        const results = await spec.run();
        await dev.change((d) => {
          d.testrunner.data = results;
          d.testrunner.spinning = false;
        });
      };

      const run = (label: string, module: t.SpecImport, immediate?: boolean) => {
        dev.button(`run: ${label}`, (e) => invoke(module));
        if (immediate) invoke(module);
      };

      run('WebRTC.SPEC', import('./WebRTC.SPEC.mjs'), false);
    });
  });
});
