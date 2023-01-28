import { Dev, t, rx, Filesystem } from '../test.ui';

type T = { results?: t.TestSuiteRunResponse };
const initial: T = {};

async function tmp() {
  /**
   * Sample: Base Driver (DB)
   */
  console.log('Filesystem', Filesystem);
  console.log('-------------------------------------------');

  const id = 'fs.dev';
  const db = await Filesystem.Driver.IndexedDb({ id });
  const { driver } = db;

  console.log('db', db);

  const json = JSON.stringify({ foo: 123 });
  const data = new TextEncoder().encode(json);

  const uri = 'path:foo/bar.json';
  await driver.io.write(uri, data);

  const driverRead = new TextDecoder().decode((await driver.io.read(uri)).file?.data);
  console.log('driver/read:', typeof driverRead, driverRead);
  console.log('-------------------------------------------');

  /**
   * Sample: Bus/Controller
   */
  const bus = rx.bus();
  const controller = Filesystem.Bus.Controller({ id, bus, driver });

  bus.$.subscribe((e) => {
    console.log('💦', e);
  });

  const fs = controller.fs();
  const fsRead = await fs.json.read(uri);
  console.log('read (fs):', fsRead);

  console.log('-------------------------------------------');
  console.log('manifest', await fs.manifest());
  console.log('info', await fs.info('foo'));
}

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    await tmp();

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return (
          <div style={{ padding: 10 }}>
            <Dev.TestRunner.Results data={e.state.results} />
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'sys.fs.indexeddb'} data={e.state} expand={1} />);

    const run = (label: string, module: t.SpecImport) => {
      dev.button(`run: ${label}`, async (e) => {
        const spec = (await module).default;
        const results = await spec.run();
        await e.change((d) => (d.results = results));
      });
    };

    // run('PeerNetbus', import('../web.PeerNetbus/PeerNetbus.SPEC.mjs'));
    // run('PeerEvents', import('../web.PeerNetwork.events/PeerEvents.SPEC.mjs'));

    // dev.hr();
    dev.button('clear', (e) => e.change((d) => (d.results = undefined)));
    dev.hr();
  });
});
