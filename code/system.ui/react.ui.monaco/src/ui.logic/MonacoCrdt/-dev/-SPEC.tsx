import { t, Dev, css, Color, COLORS, Value } from './common';
import { DevLayout, DevLayoutProps } from './DEV.Layout';
import { MonacoCrdt } from '..';

type T = { layout: DevLayoutProps };
const initial: T = { layout: { peerNames: [] } };

export default Dev.describe('MonacoCrdt', (e) => {
  type LocalStore = { peerTotal: number };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.monaco.crdt');
  const local = localstore.object({ peerTotal: 2 });

  const setPeerTotal = async (total: number, state: T) => {
    local.peerTotal = total;
    state.layout.peerNames = Array.from({ length: total }).map((_, i) => `Peer-${i + 1}`);
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => setPeerTotal(local.peerTotal, d));

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <DevLayout
            {...e.state.layout}
            onReady={(e) => {
              console.log('⚡️ layout ready', e);
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'MonacoCrdt'} data={e.state} expand={1} />);

    dev.section('Peers', (dev) => {
      const total = (total: number) => {
        const label = `${total} ${Value.plural(total, 'peer', 'peers')}`;
        dev.button(label, (e) => e.change((d) => setPeerTotal(total, d)));
      };
      total(1);
      total(2);
      total(3);
    });

    dev.hr(5, 20);

    dev.section('Unit Tests', async (dev) => {
      const run = async (bundle: t.BundleImport) => {
        const tests = (await bundle).default;
        await dev.change((d) => (d.layout.isRunningTests = true));
        await dev.change(async (d) => {
          d.layout.testResults = await tests.run();
          d.layout.isRunningTests = false;
        });
      };

      dev.button('run all tests', (e) => run(import('./-TEST.mjs')));
      dev.button('clear', (e) => e.change((d) => (d.layout.testResults = undefined)));
    });
  });
});
