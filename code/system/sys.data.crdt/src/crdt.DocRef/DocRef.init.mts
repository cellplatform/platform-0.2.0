import { rx, t, Automerge, Is } from './common';

const { isAutomerge } = Automerge;

/**
 * In-memory CRDT document reference (wrapper).
 */
export function createDocRef<D extends {}>(
  initial: D | Uint8Array, // NB: Uint8Array is a serialized Automerge document.
  options: {
    dispose$?: t.Observable<any>;
    onChange?: t.CrdtDocRefChangeHandler<D>;
  } = {},
) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => {
    _isDisposed = true;
    onChangeHandlers.clear();
  });

  const $ = new rx.Subject<t.CrdtDocAction<D>>();
  let _doc: D = Wrangle.automergeDoc(initial);

  const onChangeHandlers = new Set<t.CrdtDocRefChangeHandler<D>>();
  const fireOnChange = (change?: Uint8Array) => {
    const doc = _doc;
    if (change) onChangeHandlers.forEach((fn) => fn({ doc, change }));
  };

  const api: t.CrdtDocRef<D> = {
    $: $.asObservable(),

    get id() {
      /**
       * The "actorID" is conceptually similar to a unique process-id.
       *
       * NOTES:
       *   source: Automerge Docs
       *   url:    https://automerge.org/docs/cookbook/persistence/
       *
       *  "The actorId is a byte-aligned hexidecimal string that
       *   uniquely identifies the current node. While there are many models
       *   for persistence and synchronization, every actor/thread/process
       *   which can generate unique changes to your document should be
       *   considered its own actor; In the most straightforward and default
       *   case, you omit actorId, a random UUID is generated. If you pass
       *   in your own actorId, you must ensure that there can never be two
       *   different processes with the same actor ID. Even if you have two
       *   different processes running on the same machine, they must have
       *   distinct actor IDs."
       */
      const actor = Automerge.getActorId(_doc);
      return { actor };
    },

    /**
     * The current document.
     */
    get current() {
      return _doc;
    },

    /**
     * Change mutator.
     */
    change(fn) {
      if (api.isDisposed) return api;
      const doc = (_doc = Automerge.change<D>(_doc, (doc) => fn(doc as D)));
      const change = Automerge.getLastLocalChange(doc);
      fireOnChange(change);
      $.next({ action: 'change', doc, change });
      return api;
    },

    /**
     * Complete replacement of the document.
     * This is typically used internally for sync operations (etc).
     * For normal document usage, use the [change] method.
     */
    replace(doc) {
      if (api.isDisposed) return api;
      if (!isAutomerge(doc)) {
        throw new Error('Cannot replace with a non-Automerge document');
      }
      _doc = doc;
      $.next({ action: 'replace', doc });
      return api;
    },

    /**
     * Change handlers.
     */
    onChange(fn) {
      if (api.isDisposed) return api;
      onChangeHandlers.add(fn);
      return api;
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

  /**
   * Initial setup.
   */
  if (options.onChange) onChangeHandlers.add(options.onChange);
  if (onChangeHandlers.size > 0 && !isAutomerge(initial)) {
    // NB: If this was a new Automerge document, then ensure the initial change-set
    //     (created via [Automerge.from]) is broadcast to any listeners.
    fireOnChange(Automerge.getLastLocalChange(_doc));
  }

  return api;
}

/**
 * Helpers
 */

const Wrangle = {
  automergeDoc<D extends {}>(initial: D | Uint8Array) {
    if (initial instanceof Uint8Array) {
      const [doc] = Automerge.applyChanges<D>(Automerge.init(), [initial]);
      return doc;
    } else {
      return isAutomerge(initial) ? initial : Automerge.from<D>(initial);
    }
  },
};
