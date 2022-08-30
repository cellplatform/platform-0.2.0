import { BusEvents } from '../BusEvents/index.mjs';
import { DEFAULT, describe, expect, FsMock, it, rx, slug, t } from '../TEST/index.mjs';
import { BusController } from './index.mjs';

const MockSetup = (options: { dir?: string } = {}) => {
  const { dir } = options;
  const driver = FsMock.Driver({ dir }).driver;
  const indexer = FsMock.Indexer({ dir }).indexer;
  return { driver, indexer };
};

const TestPrep = (options: { dir?: string; id?: string } = {}) => {
  const { dir, id = `foo.${slug()}` } = options;
  const mock = MockSetup({ dir });
  const { driver, indexer } = mock;

  const bus = rx.bus<t.SysFsEvent>();
  const controller = BusController({ id, driver, bus, indexer });

  const events = controller.events;
  const { dispose } = events;

  return { bus, controller, events, dispose, mock };
};

describe('BusController', function () {
  it('id (specified)', () => {
    const bus = rx.bus<t.SysFsEvent>();
    const driver = FsMock.Driver().driver;
    const indexer = FsMock.Indexer().indexer;

    const id = 'foo';
    const controller = BusController({ id, bus, driver, indexer });
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

  it('controller.fs', async () => {
    const mock = TestPrep();

    const file1 = FsMock.randomFile(10);
    const file2 = FsMock.randomFile(50);
    const file3 = FsMock.randomFile(100);

    const fs1 = mock.controller.fs();
    const fs2 = mock.controller.fs('images');
    const fs3 = mock.controller.fs({ dir: 'images/' });

    await fs1.write('images/tree1.png', file1.data);
    await fs2.write('tree2.png', file2.data);
    await fs3.write('tree3.png', file3.data);

    const read1 = await fs1.read('images/tree1.png');
    const read2 = await fs2.read('tree2.png');
    const read3 = await fs3.read('tree3.png');

    expect(read1).to.eql(file1.data);
    expect(read2).to.eql(file2.data);
    expect(read3).to.eql(file3.data);
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

  describe('dispose', () => {
    it('disposing Controller disposes Events', () => {
      const mock = TestPrep();

      let count = 0;
      mock.events.dispose$.subscribe(() => count++);
      mock.controller.dispose();
      mock.controller.dispose();
      expect(count).to.eql(1);
    });

    it('disposing Event disposes Controller', () => {
      const mock = TestPrep();

      let count = 0;
      mock.controller.dispose$.subscribe(() => count++);
      mock.events.dispose();
      mock.events.dispose();
      expect(count).to.eql(1);
    });
  });
});
