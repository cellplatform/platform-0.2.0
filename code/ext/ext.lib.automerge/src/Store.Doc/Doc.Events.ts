import { rx, type t } from './common';

/**
 * Generate a new events wrapper for the given handle.
 */
export function eventsFactory<T>(
  doc: t.DocRefHandle<T>,
  options: { dispose$?: t.UntilObservable } = {},
) {
  type E = t.DocEvents<T>;
  const handle = doc.handle;
  const uri = handle.url;

  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    unlisten();
    fire$?.complete();
  });

  const fire$ = rx.subject<t.DocEvent<T>>();
  const $ = fire$.pipe(rx.takeUntil(dispose$));
  const fire = (e: t.DocEvent<T>) => fire$.next(e);

  const ephemeral: E['ephemeral'] = {
    in$: rx.payload<t.DocEphemeralInEvent<T>>($, 'crdt:doc/Ephemeral:in'),
    out$: rx.payload<t.DocEphemeralOutEvent<T>>($, 'crdt:doc/Ephemeral:out'),
    type$<M extends t.CBOR>(filter?: t.DocEphemeralFilter<T, M>) {
      type TIncoming = t.DocEphemeralIn<T, M>;
      const $ = ephemeral.in$ as t.Observable<TIncoming>;
      return filter ? $.pipe(rx.filter(filter)) : $;
    },
  };

  /**
   * Handlers.
   */
  const onChange = (e: t.DocHandleChangePayload<T>) => {
    const { doc, patches, patchInfo } = e;
    fire({ type: 'crdt:doc/Changed', payload: { uri, doc, patches, patchInfo } });
  };

  const onEphemeralInbound = (e: t.DocHandleEphemeralMessagePayload<T>) => {
    const payload: t.DocEphemeralIn<T> = {
      direction: 'incoming',
      doc,
      sender: { id: e.senderId },
      message: e.message as t.CBOR,
    };
    fire({ type: 'crdt:doc/Ephemeral:in', payload });
  };

  const onEphemeralOutbound = (e: t.DocHandleOutboundEphemeralMessagePayload<T>) => {
    const data = e.data;
    const payload: t.DocEphemeralOut<T> = { direction: 'outgoing', doc, data };
    fire({ type: 'crdt:doc/Ephemeral:out', payload });
  };

  /**
   * Listen.
   */
  handle.on('change', onChange);
  handle.on('ephemeral-message', onEphemeralInbound);
  handle.on('ephemeral-message-outbound', onEphemeralOutbound);
  const unlisten = () => {
    handle.off('change', onChange);
    handle.off('ephemeral-message', onEphemeralInbound);
    handle.off('ephemeral-message-outbound', onEphemeralOutbound);
  };

  /**
   * API
   */
  const api: E = {
    $,
    changed$: rx.payload<t.DocChangedEvent<T>>($, 'crdt:doc/Changed'),
    ephemeral,

    /**
     * Lifecycle
     */
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  };
  return api;
}
