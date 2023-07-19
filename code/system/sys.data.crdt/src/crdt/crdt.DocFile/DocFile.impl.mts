import { Automerge, DEFAULTS, rx, type t } from './common';
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
  doc: t.CrdtDocRef<D>,
  options: Options<D> = {},
) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => {
    _isDisposed = true;
    onChange$.complete();
    action$.complete();
  });

  let _isLogging = Wrangle.isLogging(options);
  let _isAutosaving = Wrangle.isAutosaving(options);

  const action$ = new rx.Subject<t.CrdtFileAction>();
  const onChange$ = new rx.Subject<t.CrdtDocRefChangeHandlerArgs<D>>();
  const onChange: t.CrdtDocRefChangeHandler<D> = (e) => {
    if (!_isDisposed) {
      onChange$.next(e);
      options.onChange?.(e);
    }
  };

  // NB: Must be initialized before the [DocRef] below to catch the first change (upon initialization).
  saveLogStrategy(filedir, {
    doc,
    onChange$,
    dispose$,
    enabled: () => _isLogging,
    onSave: (e) => action$.next(e),
  });

  /**
   * [DocRef]
   */
  doc.onChange(onChange);
  doc.dispose$.subscribe(dispose);

  /**
   * [DocFile]
   */
  const api: t.CrdtDocFile<D> = {
    kind: 'Crdt:DocFile',

    /**
     * CRDT document reference.
     */
    doc,

    /**
     * Observable events.
     */
    $: action$.pipe(rx.takeUntil(dispose$)),

    /**
     * Flag indicating if the document is autosaved after (de-bounced) changes.
     */
    get autosaving() {
      return _isAutosaving;
    },
    set autosaving(value: boolean) {
      _isAutosaving = value;
    },

    /**
     * Flag indicating if the document is saving incremental changes to a log file.
     */
    get logging() {
      return _isLogging;
    },
    set logging(value: boolean) {
      _isLogging = value;
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
      if (api.disposed || !(await api.exists())) return;
      const data = await filedir.read(filename);
      if (data) api.doc.replace(Automerge.load<D>(data));
    },

    /**
     * Save the document to the file-system.
     */
    async save() {
      if (api.disposed) return;
      const data = Automerge.save(doc.current);
      const { bytes, hash } = await filedir.write(filename, data);
      action$.next({
        action: 'saved',
        kind: 'file',
        filename,
        bytes,
        hash,
      });
    },

    /**
     * Delete the document from the file-system.
     */
    async delete() {
      // Single file.
      const exists = await filedir.exists(filename);
      await filedir.delete(filename);

      // Log files.
      const logdir = filedir.dir(DEFAULTS.doc.logdir);
      const log = await logdir.manifest();
      const logfiles = log.files.length;
      if (logfiles > 0) {
        await Promise.all(log.files.map((file) => logdir.delete(file.path)));
      }

      // Alert listeners.
      action$.next({
        action: 'deleted',
        file: exists ? 1 : 0,
        logfiles,
      });
    },

    /**
     * Disposal.
     */
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  autoSaveStrategy(api, {
    debounce: Wrangle.autosaveDebounce(options.autosave),
    enabled: () => api.autosaving,
  });
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
