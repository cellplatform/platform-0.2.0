import { PeerSyncer } from '.';
import { expect, rx, Time, Test } from '../test.ui';
import { Automerge } from './common';

export default Test.describe('PeerSyncer', (e) => {
  type Doc = { name?: string; count: number };

  function createTestDoc() {
    const doc = Automerge.init<Doc>();
    return Automerge.change(doc, (doc) => (doc.count = 0));
  }

  const PeerSyncerConnectionMock = () => {
    const a = rx.bus();
    const b = rx.bus();
    const { dispose, dispose$ } = rx.bus.connect([a, b]);
    return { a, b, dispose, dispose$ };
  };

  e.it('sync (via mock)', async (e) => {
    let docA = createTestDoc();
    let docB = createTestDoc();

    const conn = PeerSyncerConnectionMock();

    const syncerA = PeerSyncer(
      conn.a,
      () => docA,
      (d) => (docA = d),
    );

    const syncerB = PeerSyncer(
      conn.b,
      () => docB,
      (d) => (docB = d),
    );

    expect(docA).to.eql({ count: 0 });
    expect(docB).to.eql({ count: 0 });

    docA = Automerge.change(docA, (doc) => (doc.name = 'Foo'));
    docB = Automerge.change(docB, (doc) => (doc.count = 1234));

    expect(docA).to.eql({ name: 'Foo', count: 0 });
    expect(docB).to.eql({ count: 1234 });

    syncerA.update();
    await Time.wait(10);

    expect(docA).to.eql({ name: 'Foo', count: 1234 });
    expect(docB).to.eql(docA);

    docB = Automerge.change(docB, (doc) => (doc.name = 'Bar'));
    syncerB.update();
    await Time.wait(10);

    expect(docB).to.eql({ name: 'Bar', count: 1234 });
    expect(docB).to.eql(docA);

    conn.dispose();
  });
});
