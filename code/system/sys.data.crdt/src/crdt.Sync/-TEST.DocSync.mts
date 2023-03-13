import { DocSync } from '.';
import { DocRef } from '../crdt.DocRef';
import { TestFilesystem, expect, rx, t, Test, Time, DEFAULTS } from '../test.ui';

export default Test.describe('Sync Protocol: DocSync', (e) => {
  type D = { name?: string; count: number };

  function ConnectionMock() {
    const a = { bus: rx.bus() };
    const b = { bus: rx.bus() };
    const conn = rx.bus.connect([a.bus, b.bus]);
    const dispose = () => conn.dispose();
    return { a, b, dispose };
  }

  e.describe('initialize', (e) => {
    const bus = rx.bus();

    e.it('init: pass {onChange} option to [DocRef] constructor', async (e) => {
      const fired: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const onChange: t.CrdtDocRefChangeHandler<D> = (e) => fired.push(e);

      const sync = DocSync.init<D>(bus, { count: 0 }, { onChange });

      sync.doc.change((d) => d.count++);
      expect(fired.length).to.eql(2); // NB: the {onChange} handler successfully registered on to the [DocRef].
      sync.dispose();
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const fired: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const onChange: t.CrdtDocRefChangeHandler<D> = (e) => fired.push(e);

      const docRef = DocRef.init<D>({ count: 0 });
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
      const sync = DocSync.init<D>(bus, { count: 0 });

      let fired = 0;
      sync.dispose$.subscribe(() => fired++);

      expect(sync.isDisposed).to.eql(false);
      await sync.dispose();
      await sync.dispose();
      expect(fired).to.eql(1);
      expect(sync.isDisposed).to.eql(true);
    });

    e.it('dispose via { dispose$ } option', async (e) => {
      const { dispose, dispose$ } = rx.disposable();

      const sync = DocSync.init<D>(bus, { count: 0 }, { dispose$ });
      expect(sync.isDisposed).to.eql(false);
      dispose();
      expect(sync.isDisposed).to.eql(true);
    });

    e.it('disposing of [DocSync] does not dispose the wrapped [DocRef]', async (e) => {
      const sync = DocSync.init<D>(bus, { count: 0 });

      expect(sync.isDisposed).to.eql(false);
      expect(sync.doc.isDisposed).to.eql(false);

      await sync.dispose();
      expect(sync.isDisposed).to.eql(true);
      expect(sync.doc.isDisposed).to.eql(false);
    });

    e.it('disposing of the wrapped [DocRef] does dispose the [DocSync]', async (e) => {
      const sync = DocSync.init<D>(bus, { count: 0 });

      let fired = 0;
      sync.dispose$.subscribe(() => fired++);

      expect(sync.isDisposed).to.eql(false);
      expect(sync.doc.isDisposed).to.eql(false);

      sync.doc.dispose();

      expect(sync.isDisposed).to.eql(true);
      expect(sync.doc.isDisposed).to.eql(true);
      expect(fired).to.eql(1);

      await sync.dispose();
    });
  });

  e.describe('sync', (e) => {
    e.it('syncs between [docA] and [docB]', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>({ count: 0 });
      const docB = DocRef.init<D>({ count: 0 });

      const debounce = 0;
      const syncerA = DocSync.init<D>(mock.a.bus, docA, { debounce });
      const syncerB = DocSync.init<D>(mock.b.bus, docB, { debounce });

      expect(syncerA.doc).to.equal(docA);
      expect(syncerB.doc).to.equal(docB);
      expect(syncerA.doc.current).to.eql({ count: 0 });
      expect(syncerB.doc.current).to.eql({ count: 0 });

      docA.change((doc) => (doc.name = 'Foo'));
      docB.change((doc) => (doc.count = 1234));

      expect(syncerA.doc.current).to.eql({ name: 'Foo', count: 0 });
      expect(syncerB.doc.current).to.eql({ count: 1234 });

      await Time.wait(50);

      expect(docA.current).to.eql({ name: 'Foo', count: 1234 });
      expect(docB.current).to.eql(docA.current);

      docB.change((doc) => (doc.name = 'Bar'));
      await Time.wait(50);

      expect(docB.current).to.eql({ name: 'Bar', count: 1234 });
      expect(docB.current).to.eql(docA.current);

      expect(syncerA.count).to.eql(4);
      expect(syncerB.count).to.eql(4);

      mock.dispose();
      syncerA.dispose();
      syncerB.dispose();
    });

    e.it('syncOnStart: true (default)', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>({ count: 0 });
      const docB = DocRef.init<D>({ count: 0 });

      // NB: make some changes before syncer init.
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);

      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(0);

      const debounce = 0;
      const syncerA = DocSync.init<D>(mock.a.bus, docA, { debounce });
      const syncerB = DocSync.init<D>(mock.b.bus, docB, { debounce });

      await Time.wait(50);
      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(3); // NB: Sync has occured (automatically)

      mock.dispose();
      syncerA.dispose();
      syncerB.dispose();
    });

    e.it('syncOnStart: false', async (e) => {
      const mock = ConnectionMock();
      const docA = DocRef.init<D>({ count: 0 });
      const docB = DocRef.init<D>({ count: 0 });

      // NB: make some changes before syncer init.
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);
      docA.change((d) => d.count++);

      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(0);

      const options: t.CrdtDocSyncOptions<D> = { debounce: 0, syncOnStart: false };
      const syncerA = DocSync.init<D>(mock.a.bus, docA, options);
      const syncerB = DocSync.init<D>(mock.b.bus, docB, options);

      await Time.wait(50);
      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(0); // NB: Sync not initiated.

      // Initiate the sync manually.
      syncerA.update();

      await Time.wait(50);
      expect(docA.current.count).to.eql(3);
      expect(docB.current.count).to.eql(3);

      mock.dispose();
      syncerA.dispose();
      syncerB.dispose();
    });
  });

  e.describe('filedir (persist sync-state)', (e) => {
    e.it('persists sync-state', async (e) => {
      const fs = TestFilesystem.memory().fs;
      const filedir = fs.dir('my-crdt');

      const mock = ConnectionMock();
      const docA = DocRef.init<D>({ count: 0 });
      const docB = DocRef.init<D>({ count: 0 });

      const debounce = 0;
      const syncerA = DocSync.init<D>(mock.a.bus, docA, { debounce, filedir });
      const syncerB = DocSync.init<D>(mock.b.bus, docB, { debounce });

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
      syncerA.dispose();
      syncerB.dispose();
    });
  });
});
