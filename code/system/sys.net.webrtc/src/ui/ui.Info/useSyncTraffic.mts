import { useEffect, useState } from 'react';
import { rx, t } from './common';

/**
 * Accumulate network traffic stats from all syncers.
 */
export function useSyncTraffic(info?: t.WebRtcInfo) {
  const syncers = info?.syncers ?? [];
  const ids = syncers.map((item) => item.syncer.doc.id.doc);

  const [bytes, setBytes] = useState(0);
  const [messages, setMessages] = useState(0);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    const update = (count: number, bytes: number) => {
      setMessages(count);
      setBytes(bytes);
    };

    syncers.map(({ syncer }) => {
      syncer.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => update(e.count, e.bytes));
      update(syncer.count, syncer.bytes);
    });

    return dispose;
  }, [ids.join(':')]);

  return {
    syncers,
    messages,
    bytes,
  };
}
