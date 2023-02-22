import { t, DEFAULTS, Automerge, rx } from './common';
import { DocRef } from './DocRef.mjs';
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
  } = {},
) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => (_isDisposed = true));

  const filename = DEFAULTS.doc.filename;
  const doc = CrdtIs.ref(initial) ? initial : DocRef<D>(initial);

  if (options.autosaveDebounce) {
    doc.$.pipe(
      rx.takeUntil(dispose$),
      rx.debounceTime(options.autosaveDebounce),
      rx.filter((e) => e.action === 'change' || e.action === 'replace'),
    ).subscribe(() => api.save());
  }

  const api: t.CrdtDocFile<D> = {
    doc,

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
     * Load (and replace) the document from the file-system.
     */
    async load() {
      if (api.isDisposed) return;
      if (!(await api.exists())) return;
      const data = await filedir.read(filename);
      if (data) api.doc.replace(Automerge.load<D>(data));
    },

    /**
     * Save the document to the file-system.
     */
    async save() {
      if (api.isDisposed) return;
      const data = Automerge.save(doc.current);
      await filedir.write(filename, data);
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
