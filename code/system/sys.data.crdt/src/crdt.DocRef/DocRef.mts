import { rx, t, Automerge } from './common';

const { isAutomerge } = Automerge;

/**
 * In-memory CRDT document reference (wrapper).
 */
export function DocRef<D extends {}>(
  initial: D,
  options: {
    dispose$?: t.Observable<any>;
    onChange?: (e: { doc: D; change: Uint8Array }) => void;
  } = {},
) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => (_isDisposed = true));

  const $ = new rx.Subject<t.CrdtDocAction<D>>();
  let _doc: D = isAutomerge(initial) ? initial : Automerge.from<D>(initial);

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
      const doc = (_doc = Automerge.change<D>(_doc, (doc) => fn(doc as D)));

      if (options.onChange) {
        const change = Automerge.getLastLocalChange(doc);
        if (change) options.onChange({ doc, change });
      }

      $.next({ action: 'change', doc });
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
      $.next({ action: 'replace', doc });
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

  if (options.onChange && !isAutomerge(initial)) {
    // NB: If this was not an Automerge document, then ensure the initial change
    //     values (created via [Automerge.from]) are fired through the listener.
    const change = Automerge.getLastLocalChange(_doc);
    if (change) options.onChange?.({ doc: _doc, change });
  }

  return api;
}
