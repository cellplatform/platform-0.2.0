import {
  describe,
  it,
  expect,
  t,

  // TestFs, TestPrep
} from '../TEST/index.mjs';

describe('BusController.Change', function () {
  // this.beforeEach(() => TestFs.reset());

  async function changeSetup<T extends t.SysFsChange>() {
    // const mock = await TestPrep();
    // const events = mock.events;
    // const io = events.io;
    // const file = await TestFs.readFile('static.test/child/kitten.jpg');
    // const fired: T[] = [];
    // events.changed$.subscribe((e) => fired.push(e.change as T));
    // return { events, dispose: mock.dispose, fired, io, file };
  }

  it.skip('write', async () => {
    // const test = await changeSetup<t.SysFsChangeWrite>();
    // const { hash, data } = test.file;
    // const path = '/foo/bar/kitten.jpg';
    // await test.io.write.fire({ path, hash, data });
    // await test.dispose();
    // expect(test.fired.length).to.eql(1);
    // expect(test.fired[0].op).to.eql('write');
    // const file = test.fired[0].files[0];
    // expect(file.path).to.eql(path);
    // expect(file.hash).to.eql(hash);
  });

  it.skip('copy', async () => {
    // const test = await changeSetup<t.SysFsChangeCopy>();
    // const { hash, data } = test.file;
    // await test.io.write.fire({ path: 'kitten.jpg', hash, data });
    // await test.io.copy.fire({ source: 'kitten.jpg', target: 'cats/howl.jpg' });
    // expect(test.fired.length).to.eql(2);
    // expect(test.fired[0].op).to.eql('write');
    // expect(test.fired[1].op).to.eql('copy');
    // const file = test.fired[1].files[0];
    // expect(file.source).to.eql('/kitten.jpg');
    // expect(file.target).to.eql('/cats/howl.jpg');
    // expect(file.hash).to.eql(hash);
    // await test.dispose();
  });

  it.skip('move', async () => {
    // const test = await changeSetup<t.SysFsChangeMove>();
    // const { hash, data } = test.file;
    // await test.io.write.fire({ path: 'kitten.jpg', hash, data });
    // await test.io.move.fire({ source: 'kitten.jpg', target: 'cats/howl.jpg' });
    // expect(test.fired.length).to.eql(2);
    // expect(test.fired[0].op).to.eql('write');
    // expect(test.fired[1].op).to.eql('move');
    // const file = test.fired[1].files[0];
    // expect(file.source).to.eql('/kitten.jpg');
    // expect(file.target).to.eql('/cats/howl.jpg');
    // expect(file.hash).to.eql(hash);
    // await test.dispose();
  });

  it.skip('delete', async () => {
    // const test = await changeSetup<t.SysFsChangeDelete>();
    // const { hash, data } = test.file;
    // await test.io.write.fire({ path: 'kitten.jpg', hash, data });
    // await test.io.delete.fire('kitten.jpg');
    // expect(test.fired.length).to.eql(2);
    // expect(test.fired[0].op).to.eql('write');
    // expect(test.fired[1].op).to.eql('delete');
    // const file = test.fired[1].files[0];
    // expect(file.path).to.eql('/kitten.jpg');
    // expect(file.hash).to.eql(hash);
    // await test.dispose();
  });

  /**
   * TODO 🐷
   */
  describe.skip('no change (event not fired)', () => {
    it.skip('write', async () => {
      //
    });
    it.skip('copy', async () => {
      //
    });
    it.skip('move', async () => {
      //
    });
    it.skip('delete', async () => {
      //
    });
  });
});
