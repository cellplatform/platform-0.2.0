import { PatchState, rx, type t } from './common';

/**
 * Event factory.
 */
export const events: t.PatchStateEventFactory<t.Peer, t.PeerModelEvents> = ($, dispose$) => {
  const lifecycle = rx.lifecycle(dispose$);
  $ = $.pipe(rx.takeUntil(lifecycle.dispose$));
  const cmd$ = PatchState.Command.filter($);

  /**
   * API
   */
  return {
    $,
    cmd: {
      $: cmd$,
      conn$: rx.payload<t.PeerModelConnCmd>(cmd$, 'Peer:Conn'),
      data$: rx.payload<t.PeerModelDataCmd>(cmd$, 'Peer:Data'),
    },

    /**
     * Lifecycle
     */
    dispose: lifecycle.dispose,
    dispose$: lifecycle.dispose$,
    get disposed() {
      return lifecycle.disposed;
    },
  };
};
