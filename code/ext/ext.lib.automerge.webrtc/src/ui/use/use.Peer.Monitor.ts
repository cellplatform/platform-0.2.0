import { useEffect, useState } from 'react';
import { rx, type t } from './common';

/**
 * Monitor how much data is being transmitted through the network.
 */
export function usePeerMonitor(network?: t.WebrtcStore) {
  const peer = network?.peer;
  const [isConnected, setConnected] = useState(false);
  const [bytesIn, setBytesIn] = useState(0);
  const [bytesOut, setBytesOut] = useState(0);

  /**
   * Monitor peer total.
   */
  useEffect(() => {
    const events = peer?.events();
    events?.cmd.conn$.subscribe(() => {
      const total = peer?.current.connections.length ?? 0;
      setConnected(total > 0);
    });
    return events?.dispose;
  }, [peer?.id]);

  /**
   * Monitor bytes transmitted.
   */
  useEffect(() => {
    const events = network?.events();
    if (network && events) {
      const $ = events.message$.pipe(rx.map(() => network.total.bytes));
      $.subscribe((bytes) => {
        setBytesIn(bytes.in);
        setBytesOut(bytes.out);
      });
    }
    return events?.dispose;
  }, [peer?.id]);

  /**
   * API
   */
  return {
    isConnected,
    bytes: {
      in: bytesIn,
      out: bytesOut,
      total: bytesIn + bytesOut,
    },
  } as const;
}
