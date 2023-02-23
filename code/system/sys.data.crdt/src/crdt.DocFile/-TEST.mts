import { DocFile } from '.';
import { Crdt } from '../crdt';
import { slug, Automerge, DEFAULTS, expect, rx, t, Test, TestFilesystem, Time } from '../test.ui';

export default Test.describe('DocFile', (e) => {
  type D = { count: number; name?: string };
  const initial: D = { count: 0 };

  e.it('exposed from root API: Crdt.Doc.file', (e) => {
    expect(Crdt.Doc.file).to.equal(DocFile);
  });

  e.describe('initialize', (e) => {
    e.it('init: does not yet exist in filesystem', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);
      expect(file.doc.current).to.eql(initial);
      expect(await file.exists()).to.eql(false);
      file.dispose();
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = Crdt.Doc.ref<D>(initial);
      const file = await DocFile<D>(filedir, doc);
      expect(file.doc).to.equal(doc);
      file.dispose();
    });

    e.it('init: loads existing data', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file1 = await DocFile<D>(filedir, initial);

      file1.doc.change((d) => (d.count = 1234));
      await file1.save();

      const file2 = await DocFile<D>(filedir, initial);
      expect(file2.doc.current).to.eql({ count: 1234 });

      file1.dispose();
      file2.dispose();
    });
  });

  e.describe('dispose', (e) => {
    e.it('file.dispose() method', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);

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
      const file = await DocFile<D>(filedir, initial, { dispose$ });

      expect(file.isDisposed).to.eql(false);
      dispose();
      expect(file.isDisposed).to.eql(true);

      file.dispose();
    });

    e.it('disposing of [DocFile] does not dispose wrapped [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);

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
      const file = await DocFile<D>(filedir, initial);

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
      const file = await DocFile<D>(filedir, initial);
      const original = {
        ref: file.doc,
        doc: file.doc.current,
      };

      const fired: t.CrdtDocAction<D>[] = [];
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

  e.describe('info', (e) => {
    e.it('empty (file does not exist)', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);
      const info = await file.info();

      expect(info.exists).to.eql(false);
      expect(info.bytes).to.eql(0);
      expect(info.manifest.files).to.eql([]);
    });

    e.it('has: exists (flag), bytes, manifest', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);

      await file.save();
      const info = await file.info();

      expect(info.exists).to.eql(true);
      expect(info.bytes).to.greaterThan(100);
      expect(info.manifest.files.length).to.eql(1);
    });
  });

  /**
   * NOTES:
   *   source: Automerge Docs
   *   url:    https://automerge.org/docs/cookbook/persistence/
   *
   *  "Storing one change at a time is good for small updates to a document,
   *   since it will be more compact than storing the whole document over
   *   and over again. But storing the whole document will be more compact
   *   (and faster) than storing the whole log of changes since the document
   *   was created. This can be tested and fine-tuned based on the number of
   *   changes you're saving at any one given time. If you're saving hundreds
   *   of changes, it is probably more efficienty to simply write the whole
   *   document to disk using Automerge.save(doc). If you have a long history
   *   and only want to sync one change, then using getLastLocalChange will be
   *   more efficient."
   */

  e.describe('persistence strategy: complete compressed file - autosave (debounced)', (e) => {
    e.it('does not auto-save by default', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);
      expect(file.isAutosaving).to.eql(false);

      await Time.wait(30);
      const m = await filedir.manifest();
      expect(m.files.length).to.eql(0);

      file.dispose();
    });

    e.it('autosaves', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const autosaveDebounce = 10; // ms
      const file = await DocFile<D>(filedir, initial, { autosaveDebounce });
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

  e.describe('persistence strategy: logfiles', (e) => {
    /**
     * TODO 🐷
     */
    e.it.skip('[getLastLocalChange] → [applyChanges]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial);

      const change1 = Automerge.getLastLocalChange(file.doc.current)!;
      expect(change1).to.eql(Automerge.getLastLocalChange(file.doc.current));

      file.doc.change((d) => (d.count = 1234));
      const change2 = Automerge.getLastLocalChange(file.doc.current)!;

      expect(change1).to.exist;
      expect(change2).to.exist;
      expect(change1).to.not.eql(change2);

      let doc = Automerge.init<D>();
      expect(doc.count).to.eql(undefined);

      [doc] = Automerge.applyChanges<D>(doc, [change1]);
      expect(doc.count).to.eql(0); // NB: Initial value (set within the [DocFile] constructor).

      [doc] = Automerge.applyChanges<D>(doc, [change2]);
      expect(doc.count).to.eql(1234);

      file.dispose();
    });

    e.it('multiple changes log', async (e) => {
      const _changes: Uint8Array[] = [];

      /**
       * TODO 🐷
       * Turn this "log saving" behavior into a function passed
       * to the DocFile options (or true to use Default log saving strategy function)
       */

      const dirname = '.log.changes';
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile<D>(filedir, initial, {
        async onChange(e) {
          // Store changes in-memory for testing below.
          _changes.push(e.change);

          // Store change as a file within the log directory.
          if (e.change instanceof Uint8Array) {
            const logdir = filedir.dir(dirname);
            const count = (await logdir.manifest()).files.length;
            const filename = `${count}.${slug()}`;
            await logdir.write(filename, e.change);
          }
        },
      });

      const getManifestFiles = async () => (await filedir.manifest()).files;
      const files1 = await getManifestFiles();
      expect(files1.length).to.eql(1); // NB: change is the initial document setup

      file.doc.change((d) => (d.count = 123));
      file.doc.change((d) => (d.count = 456));
      await Time.wait(10); // NB: setup test scenario for filename ID "<count>.<slug>" incrementer not overwriting a simple count.
      file.doc.change((d) => (d.name = 'foo'));

      await Time.wait(10);
      const files2 = await getManifestFiles();
      expect(files2.length).to.eql(4); // NB: additional changes saved as files.

      const filenames = files2.map((file) => file.path);
      expect(filenames[0].startsWith('.log.changes/0.')).to.eql(true);
      expect(filenames[1].startsWith('.log.changes/1.')).to.eql(true);
      expect(filenames[2].startsWith('.log.changes/1.')).to.eql(true); // NB: ^^^ increments safely. "<count>.<slug>"
      expect(filenames[3].startsWith('.log.changes/3.')).to.eql(true);

      // Reconstruct a document from the in-memory changes.
      let docFromChanges = Automerge.init<D>();
      [docFromChanges] = Automerge.applyChanges<D>(docFromChanges, _changes);
      expect(docFromChanges).to.eql({ count: 456, name: 'foo' });

      console.log('-------------------------------------------');
      console.log('docFromChanges', docFromChanges);

      // Reconstruct a document from the saved file changes in the log.
      const logdir = filedir.dir(dirname);
      const logfiles = (await logdir.manifest()).files;
      const logfileChanges = (await Promise.all(
        logfiles.map(async (file) => logdir.read(file.path)).filter(Boolean),
      )) as Uint8Array[];

      let docFromLogFiles = Automerge.init<D>();
      [docFromLogFiles] = Automerge.applyChanges<D>(docFromLogFiles, logfileChanges);
      expect(docFromLogFiles).to.eql({ count: 456, name: 'foo' });

      console.log('docFromLogFiles', docFromLogFiles);

      file.dispose();
    });
  });
});
