import { rx, type t } from './common';

/**
 * Helpers that wait for a specific observable event.
 */
export const waitFor = {
  /**
   * Wait for the next connection on the peer.
   */
  async nextConnection(
    peer: t.Peer,
    options: {
      dispose$?: t.Observable<any>;
      filter?: (e: t.PeerConnectionChanged) => boolean;
    } = {},
  ) {
    const $ = peer.connections$.pipe(
      rx.takeUntil(options.dispose$ ?? new rx.Subject()),
      rx.filter((e) => options.filter?.(e) ?? true),
      rx.take(1),
    );
    return (await rx.firstValueFrom($)).subject;
  },

  /**
   * Wait for the next [data connection] on the peer.
   */
  async nextDataConnection(peer: t.Peer, options: { dispose$?: t.Observable<any> } = {}) {
    const res = await waitFor.nextConnection(peer, {
      dispose$: options.dispose$,
      filter: (e) => e.kind === 'data',
    });
    return res as t.PeerDataConnection;
  },

  /**
   * Wait for the next [media connection] on the peer.
   */
  async nextMediaConnection(peer: t.Peer, options: { dispose$?: t.Observable<any> } = {}) {
    const res = await waitFor.nextConnection(peer, {
      dispose$: options.dispose$,
      filter: (e) => e.kind === 'media',
    });
    return res as t.PeerMediaConnection;
  },
};
