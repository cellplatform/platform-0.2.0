import { DocSync } from '.';
import { DocRef } from '../crdt.DocRef';

import { Automerge, expect, rx, Test, Time, t } from '../test.ui';

export default Test.describe('Sync Protocol - DocSync', (e) => {
  type D = { name?: string; count: number };

  function ConnectionMock() {
    const a = { bus: rx.bus() };
    const b = { bus: rx.bus() };
    const conn = rx.bus.connect([a.bus, b.bus]);
    const dispose = () => conn.dispose();
    return { a, b, dispose };
  }

  e.describe('initialize', (e) => {
    e.it('init: pass {onChange} option to [DocRef] constructor', async (e) => {
      const fired: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const onChange: t.CrdtDocRefChangeHandler<D> = (e) => fired.push(e);

      const sync = DocSync.init<D>({ count: 0 }, { onChange });

      sync.doc.change((d) => d.count++);
      expect(fired.length).to.eql(2); // NB: the {onChange} handler successfully registered on to the [DocRef].
      sync.dispose();
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const fired: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const onChange: t.CrdtDocRefChangeHandler<D> = (e) => fired.push(e);

      const docRef = DocRef.init<D>({ count: 0 });
      const sync = DocSync.init<D>(docRef, { onChange });
      expect(sync.doc).to.equal(docRef);

      sync.doc.change((d) => d.count++);
      expect(fired.length).to.eql(1); // NB: the {onChange} handler successfully registered on to the [DocRef].

      sync.dispose();
    });
  });

  e.describe('dispose', (e) => {
    e.it('file.dispose() method', async (e) => {
      const sync = DocSync.init<D>({ count: 0 });

      let fired = 0;
      sync.dispose$.subscribe(() => fired++);

      expect(sync.isDisposed).to.eql(false);
      sync.dispose();
      sync.dispose();
      expect(fired).to.eql(1);
      expect(sync.isDisposed).to.eql(true);

      sync.dispose();
    });

    e.it('file dispose via { dispose$ } option', async (e) => {
      const { dispose, dispose$ } = rx.disposable();

      const sync = DocSync.init<D>({ count: 0 }, { dispose$ });
      expect(sync.isDisposed).to.eql(false);
      dispose();
      expect(sync.isDisposed).to.eql(true);

      sync.dispose();
    });

    e.it('disposing of [DocFile] does not dispose the wrapped [DocRef]', async (e) => {
      const sync = DocSync.init<D>({ count: 0 });

      expect(sync.isDisposed).to.eql(false);
      expect(sync.doc.isDisposed).to.eql(false);

      sync.dispose();
      expect(sync.isDisposed).to.eql(true);
      expect(sync.doc.isDisposed).to.eql(false);

      sync.dispose();
    });

    e.it('disposing of the wrapped [DocRef] does dispose the [DocFile]', async (e) => {
      const sync = DocSync.init<D>({ count: 0 });

      let fired = 0;
      sync.dispose$.subscribe(() => fired++);

      expect(sync.isDisposed).to.eql(false);
      expect(sync.doc.isDisposed).to.eql(false);

      sync.doc.dispose();

      expect(sync.isDisposed).to.eql(true);
      expect(sync.doc.isDisposed).to.eql(true);
      expect(fired).to.eql(1);
    });
  });

  //   e.it('syncs DocRef', async (e) => {
  //     //
  //     let docA = createTestDoc();
  //     let docB = createTestDoc();
  //     const mock = ConnectionMock();
  //
  //     console.log('---------------------------------------');
  //     console.log('docA', docA);
  //   });
});
