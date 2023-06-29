import { DEFAULTS, rx, type t } from './common';
import { PeerSyncer } from './PeerSyncer.mjs';

/**
 * Extends a CRDT [DocRef] with peer-sync capabilities.
 */
export function init<D extends {}>(
  netbus: t.EventBus<any>, // An event-bus that fires over a network connection.
  doc: t.CrdtDocRef<D>,
  options: t.CrdtDocSyncOptions<D> = {},
) {
  const { syncOnStart = true, filedir } = options;

  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  let _isDisposed = false;
  dispose$.subscribe(() => ensureDisposed());
  const ensureDisposed = async () => {
    _isDisposed = true;
    change$.complete();
    await syncer.dispose();
  };

  const change$ = new rx.Subject<t.CrdtDocRefChangeHandlerArgs<D>>();
  const onChange: t.CrdtDocRefChangeHandler<D> = (e) => {
    if (!_isDisposed) {
      change$.next(e);
      options.onChange?.(e);
    }
  };

  /**
   * [DocRef]
   */
  doc.onChange(onChange);
  doc.dispose$.subscribe(dispose);
  const docid = doc.id.doc;

  /**
   * [PeerSyncer]
   */
  const syncer = PeerSyncer<D>(
    netbus,
    docid,
    () => doc.current,
    (d) => doc.replace(d),
    { filedir },
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
    kind: 'Crdt:DocSync',
    doc,

    $: syncer.$,
    update: syncer.update,

    get count() {
      return syncer.count;
    },

    get bytes() {
      return syncer.bytes;
    },

    /**
     * Disposal.
     */
    dispose$,
    get disposed() {
      return _isDisposed;
    },
    async dispose() {
      await ensureDisposed();
      dispose();
    },
  };

  if (syncOnStart) api.update();
  return api;
}
