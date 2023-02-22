import { rx, t, Automerge } from './common';

const { isAutomerge } = Automerge;

/**
 * In-memory CRDT document reference (wrapper).
 */
export function DocRef<D extends {}>(initial: D, options: { dispose$?: t.Observable<any> } = {}) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => (_isDisposed = true));

  let _doc: D = isAutomerge(initial) ? initial : Automerge.from<D>(initial);
  const $ = new rx.Subject<t.CrdtDocChange<D>>();

  const api: t.CrdtDocRef<D> = {
    $: $.asObservable(),

    get id() {
      /**
       * NOTES:
       *   source: Automerge Docs
       *   url:    https://automerge.org/docs/cookbook/persistence/
       *
       *    The actorId is a byte-aligned hexidecimal string that
       *    uniquely identifies the current node. While there are many models
       *    for persistence and synchronization, every actor/thread/process
       *    which can generate unique changes to your document should be
       *    considered its own actor; In the most straightforward and default
       *    case, you omit actorId, a random UUID is generated. If you pass
       *    in your own actorId, you must ensure that there can never be two
       *    different processes with the same actor ID. Even if you have two
       *    different processes running on the same machine, they must have
       *    distinct actor IDs.
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
      _doc = Automerge.change<D>(_doc, (doc) => fn(doc as D));
      $.next({ doc: _doc, action: 'change' });
    },

    /**
     * Complete replacement of the document.
     * This is typically used internally for sync operations (etc).
     * For normal document usage, use the [change] method.
     */
    replace(doc) {
      if (!isAutomerge(doc)) {
        throw new Error('Cannot replace with a non-Automerge document');
      }
      _doc = doc;
      $.next({ doc: _doc, action: 'replace' });
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

  return api;
}
