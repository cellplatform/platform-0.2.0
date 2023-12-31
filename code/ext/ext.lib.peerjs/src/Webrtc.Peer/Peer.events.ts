import { PatchState, rx, type t } from './common';

/**
 * Event factory.
 */
export const eventFactory: t.PatchStateEventFactory<t.Peer, t.PeerModelEvents> = ($, dispose$) => {
  const life = rx.lifecycle(dispose$);
  $ = $.pipe(rx.takeUntil(life.dispose$));

  const cmd$ = PatchState.Command.filter($);
  const cmd: t.PeerModelEvents['cmd'] = {
    $: cmd$,
    beforeOutgoing$: rx.payload<t.PeerModelBeforeOutgoingCmd>(cmd$, 'Peer:Conn/BeforeOutgoing'),
    conn$: rx.payload<t.PeerModelConnectionCmd>(cmd$, 'Peer:Conn'),
    data$: rx.payload<t.PeerModelDataCmd>(cmd$, 'Peer:Data'),
    purge$: rx.payload<t.PeerModelPurgeCmd>(cmd$, 'Peer:Purge'),
    error$: rx.payload<t.PeerModelErrorCmd>(cmd$, 'Peer:Error'),
  };

  /**
   * API
   */
  const api: t.PeerModelEvents = {
    $,
    cmd,

    /**
     * Lifecycle
     */
    dispose: life.dispose,
    dispose$: life.dispose$,
    get disposed() {
      return life.disposed;
    },
  };
  return api;
};
