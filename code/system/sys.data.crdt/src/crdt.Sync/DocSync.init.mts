import { DocRef } from '../crdt.DocRef';
import { CrdtIs } from '../crdt.Is';
import { t, rx } from './common';

type Options<D extends {}> = {
  dispose$?: t.Observable<any>;
  onChange?: t.CrdtDocRefChangeHandler<D>;
};

/**
 * Extend a CRDT [DocRef] with sync capabilities.
 */
export function init<D extends {}>(initial: D | t.CrdtDocRef<D>, options: Options<D> = {}) {
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

  /**
   * [DocRef]
   */
  const doc = CrdtIs.ref(initial) ? initial : DocRef.init<D>(initial, { onChange });
  if (CrdtIs.ref(initial)) doc.onChange(onChange);
  doc.dispose$.subscribe(dispose);

  const api: t.CrdtDocSync<D> = {
    doc,

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
