import { CrdtDoc } from '.';
import { Automerge, rx, expect, t, Test, TestFilesystem, Time, DEFAULTS } from '../test.ui';

export default Test.describe('DocFile', (e) => {
  type D = { count: number; name?: string };

  const initial: D = { count: 0 };

  e.describe('initialize', (e) => {
    e.it('init: does not yet exist in filesystem', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);
      expect(file.doc.current).to.eql(initial);
      expect(await file.exists()).to.eql(false);
      file.dispose();
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = CrdtDoc.ref<D>(initial);
      const file = await CrdtDoc.file<D>(filedir, doc);
      expect(file.doc).to.equal(doc);
      file.dispose();
    });

    e.it('init: loads existing data', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file1 = await CrdtDoc.file<D>(filedir, initial);

      file1.doc.change((d) => (d.count = 1234));
      await file1.save();

      const file2 = await CrdtDoc.file<D>(filedir, initial);
      expect(file2.doc.current).to.eql({ count: 1234 });

      file1.dispose();
      file2.dispose();
    });
  });

  e.describe('dispose', (e) => {
    e.it('file.dispose() method', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);

      let fired = 0;
      file.dispose$.subscribe(() => fired++);

      expect(file.isDisposed).to.eql(false);
      file.dispose();
      file.dispose();
      expect(fired).to.eql(1);
      expect(file.isDisposed).to.eql(true);

      file.dispose();
    });

    e.it('dispose via { dispose$ } option', async (e) => {
      const { dispose, dispose$ } = rx.disposable();

      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial, { dispose$ });

      expect(file.isDisposed).to.eql(false);
      dispose();
      expect(file.isDisposed).to.eql(true);

      file.dispose();
    });

    e.it('disposing of [DocFile] does not dispose wrapped [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);

      expect(file.isDisposed).to.eql(false);
      expect(file.doc.isDisposed).to.eql(false);

      file.dispose();
      expect(file.isDisposed).to.eql(true);
      expect(file.doc.isDisposed).to.eql(false);

      file.dispose();
    });
  });

  e.describe('filesystem I/O', (e) => {
    e.it('save', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);

      expect(await file.exists()).to.eql(false);
      expect((await filedir.manifest()).files).to.eql([]);

      await file.save();
      const m = await filedir.manifest();

      expect(await file.exists()).to.eql(true);
      expect(m.files.length).to.eql(1);

      file.dispose();
    });

    e.it('load', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);
      const original = {
        ref: file.doc,
        doc: file.doc.current,
      };

      const fired: t.CrdtDocChange<D>[] = [];
      file.doc.$.subscribe((e) => fired.push(e));

      await file.load();
      expect(await file.exists()).to.eql(false);
      expect(fired).to.eql([]);

      await file.save();
      expect(await file.exists()).to.eql(true);

      await file.load();
      expect(fired.length).to.eql(1);
      expect(fired[0].action).to.eql('replace');

      expect(file.doc).to.equal(original.ref); // NB: Replaces the underlying Automerge doc, not the ref.
      expect(file.doc.current).to.not.equal(original.doc);
      expect(file.doc.current).to.eql(original.doc); // NB: Equivalent but not the same instance.

      file.dispose();
    });
  });

  e.describe('autosave (debounced)', (e) => {
    e.it('does not auto-save by default', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);
      expect(file.isAutosaving).to.eql(false);

      await Time.wait(30);
      const m = await filedir.manifest();
      expect(m.files.length).to.eql(0);

      file.dispose();
    });

    e.it('autosaves', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const autosaveDebounce = 10; // ms
      const file = await CrdtDoc.file<D>(filedir, initial, { autosaveDebounce });
      expect(file.isAutosaving).to.eql(true);

      const m1 = await filedir.manifest();

      file.doc.change((d) => (d.count = 1234));
      const m2 = await filedir.manifest();

      await Time.wait(30);
      const m3 = await filedir.manifest();

      expect(m1.files.length).to.eql(0);
      expect(m2.files.length).to.eql(0);
      expect(m3.files.length).to.eql(1); // NB: Autosaved (after debounce).
      expect(m3.files[0].path).to.eql(DEFAULTS.doc.filename);

      file.dispose();
    });
  });

  e.describe('log persistence strategy', (e) => {
    e.it('.getLastLocalChange', async (e) => {
      // const { dispose, dispose$ } = rx.disposable();

      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);

      const change1 = Automerge.getLastLocalChange(file.doc.current);
      file.doc.change((d) => d.count++);
      const change2 = Automerge.getLastLocalChange(file.doc.current);

      console.log('-------------------------------------------');
      console.log('change1', change1);
      console.log('change2', change2);

      //
      file.dispose();
    });
  });
});
