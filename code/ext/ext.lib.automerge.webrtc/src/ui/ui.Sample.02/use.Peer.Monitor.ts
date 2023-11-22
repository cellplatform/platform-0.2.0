import { useEffect, useState } from 'react';
import { rx, type t } from './common';

/**
 * A counter for data passing through a peer.
 */
export function usePeerMonitor(network: t.WebrtcStore) {
  const peer = network.peer;
  const [isConnected, setConnected] = useState(false);
  const [bytes, setBytes] = useState(0);

  /**
   * Monitor peer total.
   */
  useEffect(() => {
    const events = peer.events();
    events.cmd.conn$.subscribe(() => {
      const total = peer.current.connections.length;
      setConnected(total > 0);
    });
    return events.dispose;
  }, [peer.id]);

  /**
   * Monitor bytes transmitted.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    network.message$
      .pipe(
        rx.takeUntil(dispose$),
        rx.map(() => network.total.bytes),
        rx.distinctWhile((prev, next) => prev === next),
      )
      .subscribe((e) => setBytes(network.total.bytes));

    return dispose;
  }, [peer.id]);

  /**
   * API
   */
  return {
    isConnected,
    bytes,
  } as const;
}
