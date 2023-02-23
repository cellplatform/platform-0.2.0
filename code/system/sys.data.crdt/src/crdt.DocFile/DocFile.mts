import { t, DEFAULTS, Automerge, rx } from './common';
import { DocRef } from '../crdt.DocRef';
import { CrdtIs } from '../crdt.Is';

type Milliseconds = number;

/**
 * TODO 🐷
 * - autosave (or not)
 * - log saving strategy
 */

/**
 * Extend a CRDT [DocRef] with file-system persistence.
 */
export async function DocFile<D extends {}>(
  filedir: t.Fs,
  initial: D | t.CrdtDocRef<D>,
  options: {
    dispose$?: t.Observable<any>;
    autosaveDebounce?: Milliseconds;
    onChange?: t.CrdtDocRefChangeHandler<D>;
  } = {},
) {
  const { onChange } = options;

  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => (_isDisposed = true));

  const filename = DEFAULTS.doc.filename;
  const doc = CrdtIs.ref(initial) ? initial : DocRef<D>(initial, { onChange });
  if (CrdtIs.ref(initial) && options.onChange) doc.onChange(options.onChange);

  if (options.autosaveDebounce) {
    doc.$.pipe(
      rx.takeUntil(dispose$),
      rx.debounceTime(options.autosaveDebounce),
      rx.filter((e) => e.action === 'change' || e.action === 'replace'),
    ).subscribe(() => api.save());
  }

  const api: t.CrdtDocFile<D> = {
    /**
     * CRDT document reference.
     */
    doc,

    /**
     * Flag indicating if the document is autosaved after (de-bounced) changes.
     */
    get isAutosaving() {
      return Boolean(options.autosaveDebounce);
    },

    /**
     * Determine if the document currently exists within the file-system.
     */
    exists() {
      return filedir.exists(filename);
    },

    /**
     * Summary info about the CRDT file.
     */
    async info() {
      const exists = await api.exists();
      const manifest = await filedir.manifest();
      const bytes = manifest.files.reduce((acc, next) => acc + next.bytes, 0);
      return { exists, bytes, manifest };
    },

    /**
     * Load (and replace) the document from the file-system.
     */
    async load() {
      if (api.isDisposed || !(await api.exists())) return;
      const data = await filedir.read(filename);
      if (data) api.doc.replace(Automerge.load<D>(data));
    },

    /**
     * Save the document to the file-system.
     */
    async save() {
      if (api.isDisposed) return;
      await filedir.write(filename, Automerge.save(doc.current));
    },

    /**
     * Disposal.
     */
    dispose,
    dispose$,
    get isDisposed() {
      return _isDisposed;
    },
  };

  await api.load();
  return api;
}
