import { PeerSyncer } from '.';
import { expect, rx, Time, Test, TestFilesystem } from '../test.ui';
import { Automerge } from './common';

export default Test.describe('PeerSyncer', (e) => {
  type Doc = { name?: string; count: number };

  function ConnectionMock() {
    const dirname = 'my-file';
    const storeA = TestFilesystem.memory();
    const storeB = TestFilesystem.memory();

    const a = { bus: rx.bus(), dir: storeA.fs.dir(dirname) };
    const b = { bus: rx.bus(), dir: storeA.fs.dir(dirname) };

    const conn = rx.bus.connect([a.bus, b.bus]);
    const dispose = () => {
      conn.dispose();
      storeA.dispose();
      storeB.dispose();
    };
    return { a, b, dispose };
  }

  function createTestDoc() {
    const doc = Automerge.init<Doc>();
    return Automerge.change(doc, (doc) => (doc.count = 0));
  }

  e.it('sync (via mock)', async (e) => {
    let docA = createTestDoc();
    let docB = createTestDoc();
    const mock = ConnectionMock();

    const syncerA = PeerSyncer(
      mock.a.bus,
      () => docA,
      (d) => (docA = d),
    );

    const syncerB = PeerSyncer(
      mock.b.bus,
      () => docB,
      (d) => (docB = d),
    );

    expect(docA).to.eql({ count: 0 });
    expect(docB).to.eql({ count: 0 });

    docA = Automerge.change(docA, (doc) => (doc.name = 'Foo'));
    docB = Automerge.change(docB, (doc) => (doc.count = 1234));

    expect(docA).to.eql({ name: 'Foo', count: 0 });
    expect(docB).to.eql({ count: 1234 });

    await syncerA.update();
    await Time.wait(30);

    expect(docA).to.eql({ name: 'Foo', count: 1234 });
    expect(docB).to.eql(docA);

    docB = Automerge.change(docB, (doc) => (doc.name = 'Bar'));
    await syncerB.update();
    await Time.wait(30);

    expect(docB).to.eql({ name: 'Bar', count: 1234 });
    expect(docB).to.eql(docA);

    expect(syncerA.count).to.eql(3);
    expect(syncerB.count).to.eql(3);

    mock.dispose();
    await syncerA.dispose();
    await syncerB.dispose();
  });
});
