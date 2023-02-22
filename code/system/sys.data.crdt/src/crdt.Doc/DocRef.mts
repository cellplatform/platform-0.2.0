import { rx, t, Automerge } from './common';

const { isAutomerge, getActorId } = Automerge;

export function DocRef<D extends {}>(initial: D) {
  let _doc: D = isAutomerge(initial) ? initial : Automerge.from<D>(initial);
  const $ = new rx.Subject<t.CrdtDocChange<D>>();

  const api: t.CrdtDocRef<D> = {
    $: $.asObservable(),

    get id() {
      return { actor: Automerge.getActorId(_doc) };
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
  };

  return api;
}
