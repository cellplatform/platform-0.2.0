import { DocSync } from '..';
import {
  ConnectionMock,
  DEFAULTS,
  expect,
  rx,
  type t,
  Test,
  TestFilesystem,
  Time,
} from '../../../test.ui';
import { DocRef } from '../../crdt.DocRef';

export default Test.describe('Sync Protocol: DocSync', (e) => {
  type D = { name?: string; count: number };
  const docid = 'my-id';

  e.describe('initialize', (e) => {
    const bus = rx.bus();
    const docRef = DocRef.init<D>(docid, { count: 0 });

    e.it('kind', async (e) => {
      const sync = DocSync.init<D>(bus, docRef);
      expect(sync.kind).to.eql('Crdt:DocSync');
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const fired: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const onChange: t.CrdtDocRefChangeHandler<D> = (e) => fired.push(e);

      const sync = DocSync.init<D>(bus, docRef, { onChange });
      expect(sync.doc).to.equal(docRef);

      sync.doc.change((d) => d.count++);
      expect(fired.length).to.eql(1); // NB: the {onChange} handler successfully registered on to the [DocRef].

      sync.dispose();
    });
  });

  e.describe('dispose', (e) => {
    const bus = rx.bus();

    e.it('dispose() method', async (e) => {
      const docRef = DocRef.init<D>(docid, { count: 0 });
      const sync = DocSync.init<D>(bus, docRef);

      let fired = 0;
      sync.dispose$.subscribe(() => fired++);

      expect(sync.disposed).to.eql(false);
      await sync.dispose();
      await sync.dispose();
      expect(fired).to.eql(1);
      expect(sync.disposed).to.eql(true);
    });

    e.it('dispose via { dispose$ } option', async (e) => {
      const docRef = DocRef.init<D>(docid, { count: 0 });
      const { dispose, dispose$ } = rx.disposable();

      const sync = DocSync.init<D>(bus, docRef, { dispose$ });
      expect(sync.disposed).to.eql(false);
      dispose();
      expect(sync.disposed).to.eql(true);
    });

    e.it('disposing of [DocSync] does not dispose the wrapped [DocRef]', async (e) => {
      const docRef = DocRef.init<D>(docid, { count: 0 });
      const sync = DocSync.init<D>(bus, docRef);

      expect(sync.disposed).to.eql(false);
      expect(sync.doc.disposed).to.eql(false);

      await sync.dispose();
      expect(sync.disposed).to.eql(true);
      expect(sync.doc.disposed).to.eql(false);
    });

    e.it('disposing of the wrapped [DocRef] does dispose the [DocSync]', async (e) => {
      const docRef = DocRef.init<D>(docid, { count: 0 });
      const sync = DocSync.init<D>(bus, docRef);

      let fired = 0;
      sync.dispose$.subscribe(() => fired++);

      expect(sync.disposed).to.eql(false);
      expect(sync.doc.disposed).to.eql(false);

      sync.doc.dispose();

      expect(sync.disposed).to.eql(true);
      expect(sync.doc.disposed).to.eql(true);
      expect(fired).to.eql(1);

      await sync.dispose();
    });
  });

  e.describe('sync', (e) => {
    e.it('syncs between [docA] and [docB]', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>(docid, { count: 0 });
      const docB = DocRef.init<D>(docid, { count: 0 });

      const debounce = 0;
      const syncDocA = DocSync.init<D>(mock.a.bus, docA, { debounce });
      const syncDocB = DocSync.init<D>(mock.b.bus, docB, { debounce });

      expect(syncDocA.doc).to.equal(docA);
      expect(syncDocB.doc).to.equal(docB);
      expect(syncDocA.doc.current).to.eql({ count: 0 });
      expect(syncDocB.doc.current).to.eql({ count: 0 });

      docA.change((doc) => (doc.name = 'Foo'));
      docB.change((doc) => (doc.count = 1234));

      expect(syncDocA.doc.current).to.eql({ name: 'Foo', count: 0 });
      expect(syncDocB.doc.current).to.eql({ count: 1234 });

      await Time.wait(50);

      expect(docA.current).to.eql({ name: 'Foo', count: 1234 });
      expect(docB.current).to.eql(docA.current);

      docB.change((doc) => (doc.name = 'Bar'));
      await Time.wait(50);

      expect(docB.current).to.eql({ name: 'Bar', count: 1234 });
      expect(docB.current).to.eql(docA.current);

      expect(syncDocA.count).to.greaterThanOrEqual(4);
      expect(syncDocB.count).to.greaterThanOrEqual(4);
      expect(syncDocA.bytes).to.greaterThanOrEqual(1450);
      expect(syncDocB.bytes).to.greaterThanOrEqual(1450);

      mock.dispose();
      syncDocA.dispose();
      syncDocB.dispose();
    });

    e.it('syncs observable ($)', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>(docid, { count: 0 });
      const docB = DocRef.init<D>(docid, { count: 0 });

      const debounce = 0;
      const syncDocA = DocSync.init<D>(mock.a.bus, docA, { debounce });
      const syncDocB = DocSync.init<D>(mock.b.bus, docB, { debounce });

      const firedA: t.PeerSyncUpdated<D>[] = [];
      const firedB: t.PeerSyncUpdated<D>[] = [];
      syncDocA.$.subscribe((e) => firedA.push(e));
      syncDocB.$.subscribe((e) => firedB.push(e));

      docA.change((doc) => (doc.name = 'Foo'));
      docB.change((doc) => (doc.count = 1234));
      await Time.wait(200);

      expect(firedA.length).to.greaterThan(5);
      expect(firedB.length).to.greaterThan(5);

      expect(firedA[5].doc.data).to.eql({ name: 'Foo', count: 1234 });
      expect(firedB[5].doc.data).to.eql({ name: 'Foo', count: 1234 });

      mock.dispose();
      syncDocA.dispose();
      syncDocB.dispose();
    });

    e.it('syncOnStart: true (default)', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>(docid, { count: 0 });
      const docB = DocRef.init<D>(docid, { count: 0 });

      // NB: make some changes before syncer init.
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);

      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(0);

      const debounce = 0;
      const syncDocA = DocSync.init<D>(mock.a.bus, docA, { debounce });
      const syncDocB = DocSync.init<D>(mock.b.bus, docB, { debounce });

      await Time.wait(50);
      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(3); // NB: Sync has occured (automatically)

      mock.dispose();
      syncDocA.dispose();
      syncDocB.dispose();
    });

    e.it('syncOnStart: false', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>(docid, { count: 0 });
      const docB = DocRef.init<D>(docid, { count: 0 });

      // NB: make some changes before syncer init.
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);

      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(0);

      const options: t.CrdtDocSyncOptions<D> = { debounce: 0, syncOnStart: false };
      const syncDocA = DocSync.init<D>(mock.a.bus, docA, options);
      const syncDocB = DocSync.init<D>(mock.b.bus, docB, options);

      await Time.wait(50);
      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(0); // NB: Sync not initiated.

      // Initiate the sync manually.
      syncDocA.update();

      await Time.wait(50);
      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(3);

      mock.dispose();
      syncDocA.dispose();
      syncDocB.dispose();
    });
  });

  e.describe('filedir (persist sync-state)', (e) => {
    e.it('persists sync-state', async (e) => {
      const fs = TestFilesystem.memory().fs;
      const filedir = fs.dir('my-crdt');

      const mock = ConnectionMock();
      const docA = DocRef.init<D>(docid, { count: 0 });
      const docB = DocRef.init<D>(docid, { count: 0 });

      const debounce = 0;
      const syncDocA = DocSync.init<D>(mock.a.bus, docA, { debounce, filedir });
      const syncDocB = DocSync.init<D>(mock.b.bus, docB, { debounce });

      docA.change((d) => (d.count = 888));
      const m1 = await filedir.manifest();
      expect(m1.files).to.eql([]);

      await Time.wait(50);
      expect(docA.current.count).to.eql(888);
      expect(docB.current.count).to.eql(888);

      const m2 = await filedir.manifest();
      expect(m2.files.length).to.eql(1);
      expect(m2.files[0].path).to.eql(DEFAULTS.sync.filename);

      mock.dispose();
      syncDocA.dispose();
      syncDocB.dispose();
    });
  });
});
