import { DocRef } from '../crdt.DocRef';
import { CrdtIs } from '../crdt.Is';
import { t, rx, DEFAULTS } from './common';
import { PeerSyncer } from './PeerSyncer.mjs';

type Milliseconds = number;
type Options<D extends {}> = {
  dispose$?: t.Observable<any>;
  onChange?: t.CrdtDocRefChangeHandler<D>;
  debounce?: Milliseconds;
};

/**
 * Extends a CRDT [DocRef] with peer-sync capabilities.
 */
export function init<D extends {}>(
  netbus: t.EventBus<any>, // An event-bus that fires over a network connection.
  initial: D | t.CrdtDocRef<D>,
  options: Options<D> = {},
) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => ensureDisposed());
  const ensureDisposed = async () => {
    _isDisposed = true;
    onChange$.complete();
    await syncer.dispose();
  };

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

  /**
   * [PeerSyncer] logic.
   */
  const syncer = PeerSyncer<D>(
    netbus,
    () => doc.current,
    (d) => doc.replace(d),
  );

  doc.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'change'),
    rx.debounceTime(options.debounce ?? DEFAULTS.sync.debounce),
  ).subscribe((e) => {
    syncer.update();
  });

  /**
   * [DocSync]
   */
  const api: t.CrdtDocSync<D> = {
    doc,

    get count() {
      return syncer.count;
    },

    /**
     * Disposal.
     */
    dispose$,
    get isDisposed() {
      return _isDisposed;
    },
    async dispose() {
      await ensureDisposed();
      dispose();
    },
  };

  return api;
}
