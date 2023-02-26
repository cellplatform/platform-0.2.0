import { DocRef } from '../crdt.DocRef';
import { CrdtIs } from '../crdt.Is';
import { Automerge, DEFAULTS, rx, t } from './common';
import { autoSaveStrategy } from './strategy.AutoSave.mjs';
import { saveLogStrategy } from './strategy.SaveLog.mjs';

type Milliseconds = number;
const filename = DEFAULTS.doc.filename;

type Options<D extends {}> = {
  dispose$?: t.Observable<any>;
  autosave?: boolean | Milliseconds;
  logsave?: boolean;
  onChange?: t.CrdtDocRefChangeHandler<D>;
};

/**
 * Extend a CRDT [DocRef] with file-system persistence.
 */
export async function init<D extends {}>(
  filedir: t.Fs,
  initial: D | t.CrdtDocRef<D>,
  options: Options<D> = {},
) {
  const autosaveDebounce = Wrangle.autosaveDebounce(options.autosave);

  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => {
    _isDisposed = true;
    onChange$.complete();
  });

  const onChange$ = new rx.Subject<t.CrdtDocRefChangeHandlerArgs<D>>();
  const onChange: t.CrdtDocRefChangeHandler<D> = (e) => {
    if (!_isDisposed) {
      onChange$.next(e);
      options.onChange?.(e);
    }
  };

  // NB: Must be initialized before the [DocRef] below to catch the first change (upon initialization).
  if (Wrangle.isLogging(options)) saveLogStrategy(filedir, onChange$, dispose$);

  /**
   * [DocRef]
   */
  const doc = CrdtIs.ref(initial) ? initial : DocRef.init<D>(initial, { onChange });
  if (CrdtIs.ref(initial)) doc.onChange(onChange);
  doc.dispose$.subscribe(dispose);

  /**
   * [DocFile]
   */
  const api: t.CrdtDocFile<D> = {
    /**
     * CRDT document reference.
     */
    doc,

    /**
     * Flag indicating if the document is autosaved after (de-bounced) changes.
     */
    get isAutosaving() {
      return Wrangle.isAutosaving(options);
    },

    /**
     * Flag indicating if the document is saving incremental changes to a log file.
     */
    get isLogging() {
      return Wrangle.isLogging(options);
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

  if (api.isAutosaving) autoSaveStrategy(api, autosaveDebounce);
  await api.load();
  return api;
}

/**
 * [Helpers]
 */
const Wrangle = {
  autosaveDebounce(input?: boolean | Milliseconds): number {
    if (input === false || input === undefined) return 0;
    if (input === true) return DEFAULTS.doc.autosaveDebounce;
    if (typeof input === 'number') return Math.max(0, input);
    throw new Error(`Invalid autosave debounce value: ${input} (expected: boolean or number)`);
  },

  isAutosaving(options: Options<any> = {}) {
    const msecs = Wrangle.autosaveDebounce(options.autosave);
    return msecs > 0;
  },

  isLogging(options: Options<any> = {}) {
    return Boolean(options.logsave);
  },
};
