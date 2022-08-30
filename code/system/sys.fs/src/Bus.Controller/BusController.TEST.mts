import {
  describe,
  it,
  expect,
  rx,
  t,
  // Filesystem,
  // TestFs,
  // TestPrep,
  slug,
  DEFAULT,
  FsMock,
} from '../TEST/index.mjs';

import { BusController } from './index.mjs';
import { BusEvents } from '../Bus.Events/index.mjs';

describe('BusController', function () {
  const MockSetup = (options: { dir?: string } = {}) => {
    const { dir } = options;
    const driver = FsMock.Driver({ dir }).driver;
    const indexer = FsMock.Indexer({ dir }).indexer;
    return { driver, indexer };
  };

  const TestPrep = (options: { dir?: string; id?: string } = {}) => {
    const { dir, id = `foo.${slug()}` } = options;
    const bus = rx.bus<t.SysFsEvent>();
    const { driver, indexer } = MockSetup({ dir });
    const controller = BusController({ id, driver, bus, indexer });
    const events = controller.events;
    const { dispose } = events;
    return { bus, controller, events, dispose };
  };

  it('id (specified)', () => {
    const bus = rx.bus<t.SysFsEvent>();
    const driver = FsMock.Driver().driver;
    const index = FsMock.Indexer().indexer;

    const id = 'foo';
    const controller = BusController({ id, bus, driver, indexer: index });
    const events = BusEvents({ id, bus });

    expect(controller.id).to.eql(id);
    expect(events.id).to.eql(id);
    controller.dispose();
  });

  it('id (generated)', () => {
    const bus = rx.bus<t.SysFsEvent>();

    const test = (id?: string) => {
      const { driver, indexer } = MockSetup();
      const controller = BusController({ id, driver, bus, indexer });
      expect(controller.id).to.eql(DEFAULT.FILESYSTEM_ID);
      controller.dispose();
    };

    test(undefined);
    test('');
    test('  ');
  });

  it('filter (global)', async () => {
    const id = 'foo';
    const { driver, indexer } = MockSetup();

    let allow = true;

    const bus = rx.bus<t.SysFsEvent>();
    const controller = BusController({ id, driver, indexer, bus, filter: (e) => allow });
    const events = BusEvents({ id, bus });
    const res1 = await events.io.info.get();

    allow = false;
    const res2 = await events.io.info.get({ timeout: 10 });

    controller.dispose();
    events.dispose();

    expect(res1.error).to.eql(undefined);
    expect(res2.error?.code).to.eql('client/timeout');
    expect(res2.error?.message).to.include('Timed out');
  });

  it('distinct (by filesystem "id")', async () => {
    const one = TestPrep({ id: 'one', dir: 'foo' });
    const two = TestPrep({ id: 'two', dir: 'bar' });
    const info1 = await one.events.io.info.get();
    const info2 = await two.events.io.info.get();
    one.dispose();
    two.dispose();
    expect(info1.id).to.eql('one');
    expect(info2.id).to.eql('two');
    expect(info1.fs?.id).to.eql('one');
    expect(info2.fs?.id).to.eql('two');

    expect(one.controller.dir).to.match(/\/foo$/);
    expect(two.controller.dir).to.match(/\/bar$/);

    expect(info1.fs?.dir).to.match(/\/foo$/);
    expect(info2.fs?.dir).to.match(/\/bar$/);
  });

  it.skip('controller.fs', async () => {
    const mock = TestPrep();

    // const mock = await TestPrep();
    // await mock.reset();
    const root = mock.controller.dir;
    // const png = await mock.readFile('static.test/child/tree.png');
    // const fs1 = mock.controller.fs();
    // const fs2 = mock.controller.fs('images');
    // const fs3 = mock.controller.fs({ dir: 'images/' });
    // await fs1.write('images/tree1.png', png.data);
    // await fs2.write('tree2.png', png.data);
    // await fs3.write('tree3.png', png.data);
    // const file1 = await mock.readFile(nodefs.join(root, 'images/tree1.png'));
    // const file2 = await mock.readFile(nodefs.join(root, 'images/tree2.png'));
    // const file3 = await mock.readFile(nodefs.join(root, 'images/tree3.png'));
    // expect(file1.hash).to.eql(png.hash);
    // expect(file2.hash).to.eql(png.hash);
    // expect(file3.hash).to.eql(png.hash);
    // await mock.dispose();
  });

  describe('ready', () => {
    it('is ready', async () => {
      const mock = TestPrep();
      const res = await mock.events.ready();
      mock.dispose();

      expect(res.ready).to.eql(true);
      expect(res.error).to.eql(undefined);
    });

    it('is not ready', async () => {
      const mock = TestPrep();
      mock.dispose();

      const res = await mock.events.ready({ timeout: 10 });
      expect(res.ready).to.eql(false);
      expect(res.error?.code).to.eql('client/timeout');
      expect(res.error?.message).to.include(`did not respond`);
    });
  });
});
