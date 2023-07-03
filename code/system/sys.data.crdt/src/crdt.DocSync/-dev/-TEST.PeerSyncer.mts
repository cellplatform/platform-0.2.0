import { PeerSyncer } from '..';
import { Automerge, ConnectionMock, Test, Time, expect, type t } from '../../test.ui';

export default Test.describe('Sync Protocol: PeerSyncer', (e) => {
  type Doc = { name?: string; count: number };

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
      'doc-id',
      () => docA,
      (d) => (docA = d),
    );

    const syncerB = PeerSyncer(
      mock.b.bus,
      'doc-id',
      () => docB,
      (d) => (docB = d),
    );

    const firedA: t.PeerSyncUpdated<Doc>[] = [];
    const firedB: t.PeerSyncUpdated<Doc>[] = [];
    syncerA.$.subscribe((e) => firedA.push(e));
    syncerB.$.subscribe((e) => firedB.push(e));

    expect(docA).to.eql({ count: 0 });
    expect(docB).to.eql({ count: 0 });

    docA = Automerge.change(docA, (doc) => (doc.name = 'Foo'));
    docB = Automerge.change(docB, (doc) => (doc.count = 1234));

    expect(docA).to.eql({ name: 'Foo', count: 0 });
    expect(docB).to.eql({ count: 1234 });

    syncerA.update();
    await Time.wait(300);

    expect(docA).to.eql({ name: 'Foo', count: 1234 });
    expect(docB).to.eql(docA);

    docB = Automerge.change(docB, (doc) => (doc.name = 'Bar'));
    syncerB.update();
    await Time.wait(300);

    expect(docB).to.eql({ name: 'Bar', count: 1234 });
    expect(docB).to.eql(docA);

    expect(firedA.length).to.greaterThan(5);
    expect(firedB.length).to.greaterThan(5);
    expect(firedA[firedA.length - 1].bytes).to.greaterThan(1000);
    expect(firedB[firedB.length - 1].bytes).to.greaterThan(1000);

    expect(syncerA.count).to.greaterThan(5);
    expect(syncerB.count).to.greaterThan(5);
    expect(syncerA.bytes).to.greaterThan(1000);
    expect(syncerB.bytes).to.greaterThan(1000);

    docA = Automerge.change(docA, (doc) => (doc.count = 888));
    docB = Automerge.change(docB, (doc) => (doc.name = 'Baz'));
    const resA = syncerA.update();
    const resB = syncerB.update();

    const complete = await Promise.all([resA.complete, resB.complete]);
    expect(complete[0].tx).to.eql(resA.tx);
    expect(complete[1].tx).to.eql(resB.tx);
    expect(complete[0].bytes).to.greaterThan(100);
    expect(complete[1].bytes).to.greaterThan(100);
    expect(complete[0].doc.id).to.eql('doc-id');
    expect(complete[1].doc.id).to.eql('doc-id');
    expect(complete[0].doc.data).to.eql(docA);
    expect(complete[1].doc.data).to.eql(docB);

    expect(docB).to.eql({ name: 'Baz', count: 888 });
    expect(docB).to.eql(docA);

    mock.dispose();
    await syncerA.dispose();
    await syncerB.dispose();
  });

  e.it('multiple docs on same netbus (do not intermingle)', async (e) => {
    let docA1 = createTestDoc();
    let docA2 = createTestDoc();
    let docB1 = createTestDoc();
    let docB2 = createTestDoc();
    const mock = ConnectionMock();

    const syncerA1 = PeerSyncer(
      mock.a.bus,
      'docA',
      () => docA1,
      (d) => (docA1 = d),
    );

    const syncerA2 = PeerSyncer(
      mock.b.bus,
      'docA',
      () => docA2,
      (d) => (docA2 = d),
    );

    const syncerB1 = PeerSyncer(
      mock.a.bus,
      'docB',
      () => docB1,
      (d) => (docB1 = d),
    );

    const syncerB2 = PeerSyncer(
      mock.b.bus,
      'docB',
      () => docB2,
      (d) => (docB2 = d),
    );

    expect(docA1).to.eql({ count: 0 });
    expect(docA2).to.eql({ count: 0 });
    expect(docB1).to.eql({ count: 0 });
    expect(docB2).to.eql({ count: 0 });

    docA1 = Automerge.change(docA1, (doc) => (doc.name = 'Foo'));
    docA2 = Automerge.change(docA2, (doc) => (doc.count = 1234));

    syncerA1.update();
    await Time.wait(300);

    expect(docA1).to.eql({ name: 'Foo', count: 1234 });
    expect(docA2).to.eql(docA1);
    expect(docB1).to.eql({ count: 0 }); // NB: not changed.
    expect(docB2).to.eql(docB1);

    docB1 = Automerge.change(docB1, (doc) => (doc.name = 'Bar'));
    docB2 = Automerge.change(docB2, (doc) => (doc.count = 888));

    syncerB1.update();
    await Time.wait(300);

    expect(docA1).to.eql({ name: 'Foo', count: 1234 });
    expect(docA2).to.eql(docA1);
    expect(docB1).to.eql({ name: 'Bar', count: 888 });
    expect(docB2).to.eql(docB1);

    mock.dispose();
    await Promise.all([
      syncerA1.dispose(),
      syncerA2.dispose(),
      syncerB1.dispose(),
      syncerB2.dispose(),
    ]);
  });

  e.it('update.complete (promise)', async (e) => {
    let docA = createTestDoc();
    let docB = createTestDoc();
    const mock = ConnectionMock();

    const syncerA = PeerSyncer(
      mock.a.bus,
      'doc-id',
      () => docA,
      (d) => (docA = d),
    );

    const syncerB = PeerSyncer(
      mock.b.bus,
      'doc-id',
      () => docB,
      (d) => (docB = d),
    );

    docA = Automerge.change(docA, (doc) => (doc.name = 'Foo'));
    docB = Automerge.change(docB, (doc) => (doc.count = 1234));

    await syncerA.update().complete;
    expect(docA).to.eql({ name: 'Foo', count: 1234 });
  });
});
