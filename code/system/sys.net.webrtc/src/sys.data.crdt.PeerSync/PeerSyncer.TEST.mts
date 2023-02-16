import { Automerge } from 'sys.data.crdt';
import { t, rx, expect, Mock, Test, Time, WebRTC } from '../test.ui';

export default Test.describe('CRDT: PeerSyncer', (e) => {
  type Doc = { name?: string; count: number };

  function createTestDoc() {
    const doc = Automerge.init<Doc>();
    return Automerge.change(doc, (doc) => (doc.count = 0));
  }

  e.it('sync (via mock DataConnection)', async (e) => {
    let docA = createTestDoc();
    let docB = createTestDoc();
    const conn = Mock.DataConnection.connect();

    const syncerA = WebRTC.Util.toSyncer(
      conn.a,
      () => docA,
      (d) => (docA = d),
    );

    const syncerB = WebRTC.Util.toSyncer(
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
  });

  e.it('sync (via mock bus)', async (e) => {
    //
    /**
     * TODO 🐷
     * - use BusConnect
     */

    console.log('-------------------------------------------');
  });
});
