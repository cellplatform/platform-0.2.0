import { DocFile } from '.';
import { Crdt } from '..';
import { Automerge, DEFAULTS, expect, rx, t, Test, TestFilesystem, Time } from '../../test.ui';

export default Test.describe('DocFile', (e) => {
  type D = { count: number; name?: string };
  const docid = 'my-id';
  const initial: D = { count: 0 };
  const createDoc = () => Crdt.Doc.ref<D>(docid, initial);

  e.it('exposed from root API: Crdt.Doc.file', (e) => {
    expect(Crdt.Doc.DocFile).to.equal(DocFile);
    expect(Crdt.Doc.file).to.equal(DocFile.init);
  });

  e.describe('initialize', (e) => {
    e.it('kind', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = createDoc();
      const file = await DocFile.init<D>(filedir, doc);
      expect(file.kind).to.eql('Crdt:DocFile');
    });

    e.it('init: does not yet exist in filesystem', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = createDoc();
      const file = await DocFile.init<D>(filedir, doc);
      expect(file.doc.current).to.eql(initial);
      expect(await file.exists()).to.eql(false);
      file.dispose();
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = createDoc();

      const fired: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const onChange: t.CrdtDocRefChangeHandler<D> = (e) => fired.push(e);

      const file = await DocFile.init<D>(filedir, doc, { onChange });
      expect(file.doc).to.equal(doc);

      file.doc.change((d) => d.count++);
      expect(fired.length).to.eql(1); // NB: the {onChange} handler successfully registered on to the [DocRef].
      file.dispose();
    });

    e.it('init: loads existing data', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = createDoc();
      const file1 = await DocFile.init<D>(filedir, doc);

      file1.doc.change((d) => (d.count = 1234));
      await file1.save();

      const file2 = await DocFile.init<D>(filedir, doc);
      expect(file2.doc.current).to.eql({ count: 1234 });

      file1.dispose();
      file2.dispose();
    });
  });

  e.describe('dispose', (e) => {
    e.it('file.dispose() method', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = createDoc();
      const file = await DocFile.init<D>(filedir, doc);

      let fired = 0;
      file.dispose$.subscribe(() => fired++);

      expect(file.disposed).to.eql(false);
      file.dispose();
      file.dispose();
      expect(fired).to.eql(1);
      expect(file.disposed).to.eql(true);
    });

    e.it('file dispose via { dispose$ } option', async (e) => {
      const { dispose, dispose$ } = rx.disposable();

      const filedir = TestFilesystem.memory().fs;
      const doc = createDoc();
      const file = await DocFile.init<D>(filedir, doc, { dispose$ });

      expect(file.disposed).to.eql(false);
      dispose();
      expect(file.disposed).to.eql(true);
    });

    e.it('disposing of [DocFile] does not dispose the wrapped [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());

      expect(file.disposed).to.eql(false);
      expect(file.doc.disposed).to.eql(false);

      file.dispose();
      expect(file.disposed).to.eql(true);
      expect(file.doc.disposed).to.eql(false);
    });

    e.it('disposing of the wrapped [DocRef] does dispose the [DocFile]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());

      let fired = 0;
      file.dispose$.subscribe(() => fired++);

      expect(file.disposed).to.eql(false);
      expect(file.doc.disposed).to.eql(false);

      file.doc.dispose();

      expect(file.disposed).to.eql(true);
      expect(file.doc.disposed).to.eql(true);
      expect(fired).to.eql(1);

      file.dispose();
    });
  });

  e.describe('filesystem I/O', (e) => {
    e.it('save', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());

      const fired: t.CrdtFileAction[] = [];
      file.$.subscribe((e) => fired.push(e));

      expect(await file.exists()).to.eql(false);
      expect((await filedir.manifest()).files).to.eql([]);

      await file.save();
      const m = await filedir.manifest();

      expect(await file.exists()).to.eql(true);
      expect(m.files.length).to.eql(1);

      expect(fired.length).to.eql(1);

      const event = fired[0] as t.CrdtFileActionSaved;
      expect(event.action).to.eql('saved');
      expect(event.kind).to.eql('file');
      expect(event.filename).to.eql('crdt.data');
      expect(event.hash).to.match(/^sha256-/);
      expect(event.bytes).to.be.greaterThan(0);

      file.dispose();
    });

    e.it('load', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());
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

    e.it('delete: file', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());

      const fired: t.CrdtFileAction[] = [];
      file.$.subscribe((e) => fired.push(e));

      const getManifest = () => filedir.manifest();
      const getCount = async () => (await getManifest()).files.length;
      expect(await getCount()).to.eql(0);

      await file.save();
      expect(await getCount()).to.eql(1);

      await file.delete();
      expect(await getCount()).to.eql(0);

      expect(fired.length).to.eql(2);
      expect(fired[0].action).to.eql('saved');
      expect(fired[1].action).to.eql('deleted');

      const event = fired[1] as t.CrdtFileActionDeleted;
      expect(event.file).to.eql(1);
      expect(event.logfiles).to.eql(0);

      file.dispose();
    });

    e.it('delete: file-log', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc(), { logsave: true });

      const fired: t.CrdtFileAction[] = [];
      file.$.subscribe((e) => fired.push(e));

      const getManifestFiles = async () => (await filedir.manifest()).files;

      file.doc.change((d) => (d.count = 123));
      file.doc.change((d) => (d.name = 'foo'));
      await Time.wait(10);

      const files1 = await getManifestFiles();
      await file.delete();
      const files2 = await getManifestFiles();

      expect(files1.length).to.eql(3);
      expect(files2.length).to.eql(0);

      await Time.wait(10);
      expect(fired.length).to.eql(4);
      expect(fired[0].action).to.eql('saved');
      expect(fired[1].action).to.eql('saved');
      expect(fired[2].action).to.eql('saved');
      expect(fired[3].action).to.eql('deleted');

      const event = fired[3] as t.CrdtFileActionDeleted;
      expect(event.file).to.eql(0);
      expect(event.logfiles).to.eql(3);

      file.dispose();
    });
  });

  e.describe('info', (e) => {
    e.it('empty (file does not exist)', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());
      const info = await file.info();

      expect(info.exists).to.eql(false);
      expect(info.bytes).to.eql(0);
      expect(info.manifest.files).to.eql([]);
    });

    e.it('has: exists (flag), bytes, manifest', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await DocFile.init<D>(filedir, createDoc());

      await file.save();
      const info = await file.info();

      expect(info.exists).to.eql(true);
      expect(info.bytes).to.greaterThan(100);
      expect(info.manifest.files.length).to.eql(1);
    });
  });

  e.describe('persistence strategies', (e) => {
    e.describe('autosave: (debounced) complete compressed file', (e) => {
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

      e.it('does not autosave by default', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file = await DocFile.init<D>(filedir, createDoc());
        expect(file.autosaving).to.eql(false);

        await Time.wait(30);
        const m = await filedir.manifest();
        expect(m.files.length).to.eql(0);

        file.dispose();
      });

      e.it('does not autosave when debounce is 0 (or negative)', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file1 = await DocFile.init<D>(filedir, createDoc(), { autosave: 0 });
        const file2 = await DocFile.init<D>(filedir, createDoc(), { autosave: -1 });
        expect(file1.autosaving).to.eql(false);
        expect(file2.autosaving).to.eql(false);
      });

      e.it('autosaves (after debounce delay)', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file = await DocFile.init<D>(filedir, createDoc(), { autosave: 10 });
        expect(file.autosaving).to.eql(true);

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

      e.it('autosaves (via True flag to options)', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file = await DocFile.init<D>(filedir, createDoc(), { autosave: true });
        expect(file.autosaving).to.eql(true);

        const m1 = await filedir.manifest();

        file.doc.change((d) => (d.count = 1234));
        await Time.wait(DEFAULTS.doc.autosaveDebounce + 10);
        const m2 = await filedir.manifest();

        expect(m1.files.length).to.eql(0);
        expect(m2.files.length).to.eql(1);
      });

      e.it('does not autosave (via False flag to options)', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const doc = createDoc();
        const file = await DocFile.init<D>(filedir, doc, { autosave: false });
        expect(file.autosaving).to.eql(false);
      });

      e.it('autosave property changed after creation', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const doc = createDoc();
        const file = await DocFile.init<D>(filedir, doc);
        expect(file.autosaving).to.eql(false);
        expect(file.logging).to.eql(false);

        const sampleChange = async () => {
          file.doc.change((d) => (d.count += 1));
          await Time.wait(DEFAULTS.doc.autosaveDebounce + 10);
          return await filedir.manifest();
        };

        const m1 = await sampleChange();

        file.autosaving = true;
        expect(file.autosaving).to.eql(true);

        const m2 = await sampleChange();

        file.autosaving = false;
        expect(file.autosaving).to.eql(false);
        const m3 = await sampleChange();

        expect(m1.files.length).to.eql(0);
        expect(m2.files.length).to.eql(1);
        expect(m3.files.length).to.eql(1);
      });
    });

    e.describe('logfiles', (e) => {
      e.it('isLogging (property)', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file1 = await DocFile.init<D>(filedir, createDoc());
        const file2 = await DocFile.init<D>(filedir, createDoc(), { logsave: true });

        expect(file1.logging).to.eql(false); // NB: default.
        expect(file2.logging).to.eql(true);

        file1.dispose();
        file2.dispose();
      });

      e.it('fires "saved:log" action ($)', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file = await DocFile.init<D>(filedir, createDoc(), { logsave: true });

        const fired: t.CrdtFileAction[] = [];
        file.$.subscribe((e) => fired.push(e));

        file.doc.change((d) => (d.count = 123));
        file.doc.change((d) => (d.name = 'foo'));
        await Time.wait(10);

        expect(fired.length).to.greaterThan(1);

        const event = fired[0] as t.CrdtFileActionSaved;
        expect(event.action).to.eql('saved');
        expect(event.kind).to.eql('log');

        expect(event.filename.length).to.greaterThan(5);
        expect(event.hash).to.match(/^sha256-/);
        expect(event.bytes).to.be.greaterThan(0);

        file.dispose();
      });

      e.it('multiple changes stored in log directory', async (e) => {
        const dirname = DEFAULTS.doc.logdir;
        const filedir = TestFilesystem.memory().fs;

        const doc = createDoc();
        const changes: Uint8Array[] = [Automerge.getLastLocalChange(doc.current)!]; // NB: Initial change.

        const file = await DocFile.init<D>(filedir, doc, {
          logsave: true,
          onChange: (e) => changes.push(e.change),
        });

        const getManifestFiles = async () => (await filedir.manifest()).files;
        const files1 = await getManifestFiles();
        expect(files1.length).to.eql(1); // NB: change is the initial document setup

        file.doc.change((d) => (d.count = 123));
        file.doc.change((d) => (d.count = 456));
        await Time.wait(10); // NB: setup test scenario for filename ID "<count>.<slug>" incrementer not overwriting a simple count.
        file.doc.change((d) => (d.name = 'foo'));

        await Time.wait(30);
        const files2 = await getManifestFiles();
        expect(files2.length).to.eql(4); // NB: additional changes saved as files.

        const filenames = files2.map((file) => file.path);
        expect(filenames[0].startsWith('local.log/0.')).to.eql(true);
        expect(filenames[1].startsWith('local.log/1.')).to.eql(true);
        expect(filenames[2].startsWith('local.log/1.')).to.eql(true); // NB: ^^^ increments safely. "<count>.<slug>"
        expect(filenames[3].startsWith('local.log/3.')).to.eql(true);

        // Reconstruct a document from the in-memory changes.
        let docFromChanges = Automerge.init<D>();
        [docFromChanges] = Automerge.applyChanges<D>(docFromChanges, changes);
        expect(docFromChanges).to.eql({ count: 456, name: 'foo' });

        // Reconstruct a document from the saved file changes in the log.
        const read = async (path: string) => (await logdir.read(path))!;
        const logdir = filedir.dir(dirname);
        const logfiles = (await logdir.manifest()).files.map(({ path }) => path);
        const outOfOrder = [1, 0, 3, 2].map((i) => logfiles[i]);
        const logfileChanges = await Promise.all(outOfOrder.map(read));

        let docFromLogFiles = Automerge.init<D>();
        [docFromLogFiles] = Automerge.applyChanges<D>(docFromLogFiles, logfileChanges);
        expect(docFromLogFiles).to.eql({ count: 456, name: 'foo' });

        file.dispose();
      });

      e.it('change isLogging after creation', async (e) => {
        const filedir = TestFilesystem.memory().fs;
        const file = await DocFile.init<D>(filedir, createDoc());
        expect(file.autosaving).to.eql(false);
        expect(file.logging).to.eql(false);

        const fired: t.CrdtFileAction[] = [];
        file.$.subscribe((e) => fired.push(e));

        file.doc.change((d) => (d.count = 123));
        await Time.wait(10);
        expect(fired.length).to.eql(0);

        file.logging = true;
        expect(file.logging).to.eql(true);

        file.doc.change((d) => (d.count = 456));
        await Time.wait(10);
        expect(fired.length).to.eql(1);

        const event = fired[0] as t.CrdtFileActionSaved;
        expect(event.action).to.eql('saved');
        expect(event.kind).to.eql('log');

        file.dispose();
      });
    });
  });
});
