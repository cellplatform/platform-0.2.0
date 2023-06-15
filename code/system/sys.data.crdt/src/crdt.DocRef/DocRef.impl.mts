import { Automerge, rx, t, Time } from './common';
import { Wrangle } from './Wrangle.mjs';
import { toObject } from '../crdt.helpers';

type Id = string;

/**
 * In-memory CRDT document reference (wrapper).
 */
export function init<D extends {}>(
  docid: Id,
  initial: D | Uint8Array, // NB: [Uint8Array] is a serialized Automerge document.
  options: {
    dispose$?: t.Observable<any>;
    onChange?: t.CrdtDocRefChangeHandler<D>;
  } = {},
): t.CrdtDocRef<D> {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => {
    _isDisposed = true;
    onChangeHandlers.clear();
  });

  const $ = new rx.Subject<t.CrdtDocAction<D>>();
  let _doc: D = Wrangle.automergeDoc(initial);
  let _history: t.CrdtDocHistory<D>[] | undefined;

  const onChangeHandlers = new Set<t.CrdtDocRefChangeHandler<D>>();
  const fireOnChange = (change?: Uint8Array) => {
    if (change) {
      _history = undefined;
      const doc = _doc;
      onChangeHandlers.forEach((fn) => fn({ doc, change }));
    }
  };

  const api: t.CrdtDocRef<D> = {
    kind: 'Crdt:DocRef',
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
      return {
        actor,
        doc: docid,
        toString: () => `${docid}:${actor}`,
      };
    },

    /**
     * The current document.
     */
    get current() {
      return _doc;
    },

    /**
     * The document change history.
     */
    get history() {
      return (_history = _history || Automerge.getHistory<D>(_doc));
    },

    /**
     * Change mutator.
     */
    change(...args: []) {
      if (api.disposed) return api;

      const time = Time.now.timestamp;
      const { message, fn } = Wrangle.changeArgs<D>(args);

      const doc = (_doc = Automerge.change<D>(_doc, { time, message }, (doc) => fn(doc as D)));
      const change = Automerge.getLastLocalChange(doc);

      fireOnChange(change);
      $.next({ action: 'change', doc, change, info: { time, message } });
      return api;
    },

    /**
     * Complete replacement of the document.
     * This is typically used internally for sync operations (etc).
     * For normal document usage, use the [change] method.
     */
    replace(doc) {
      if (api.disposed) return api;
      if (!Automerge.isAutomerge(doc)) {
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
      if (api.disposed) return api;
      onChangeHandlers.add(fn);
      return api;
    },

    /**
     * Convert the current lens state to a plain object.
     */
    toObject() {
      return toObject(api.current);
    },

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  /**
   * Initial setup.
   */
  if (options.onChange) onChangeHandlers.add(options.onChange);
  if (onChangeHandlers.size > 0 && !Automerge.isAutomerge(initial)) {
    // NB: If this was a new Automerge document, then ensure the initial change-set
    //     (created via [Automerge.from]) is broadcast to any listeners.
    fireOnChange(Automerge.getLastLocalChange(_doc));
  }

  return api;
}
