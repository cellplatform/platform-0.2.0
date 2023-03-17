import { PeerSyncer } from '..';
import { Automerge, expect, rx, Test, Time } from '../../test.ui';

export default Test.describe('Sync Protocol: PeerSyncer', (e) => {
  type Doc = { name?: string; count: number };

  function ConnectionMock() {
    const a = { bus: rx.bus() };
    const b = { bus: rx.bus() };
    const conn = rx.bus.connect([a.bus, b.bus]);
    const dispose = () => conn.dispose();
    return { a, b, dispose };
  }

  function createTestDoc() {
    const doc = Automerge.init<Doc>();
    return Automerge.change(doc, (doc) => (doc.count = 0));
  }

  e.it('syncs (via event-bus mock)', async (e) => {
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
    await Time.wait(300);

    expect(docA).to.eql({ name: 'Foo', count: 1234 });
    expect(docB).to.eql(docA);

    docB = Automerge.change(docB, (doc) => (doc.name = 'Bar'));
    await syncerB.update();
    await Time.wait(300);

    expect(docB).to.eql({ name: 'Bar', count: 1234 });
    expect(docB).to.eql(docA);

    expect([3, 4]).to.include(syncerA.count); // NB: 3 or 4 bounces (varies by environment, eg. CI).
    expect([3, 4]).to.include(syncerB.count);

    mock.dispose();
    await syncerA.dispose();
    await syncerB.dispose();
  });
});
