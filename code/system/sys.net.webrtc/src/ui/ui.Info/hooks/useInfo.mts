import { useEffect, useState } from 'react';
import { rx, type t } from '../common';

export function useInfo(client?: t.WebRtcEvents) {
  const [info, setInfo] = useState<t.WebRtcInfo | undefined>(undefined);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    if (client) {
      const update = async () => setInfo(await client.info.get());
      const changed$ = client.connections.changed.$.pipe(rx.takeUntil(dispose$));
      changed$.pipe(rx.debounceTime(300)).subscribe(update);
      update();
    }

    return dispose;
  }, [client?.instance.id]);

  /**
   * API.
   */
  return info;
}
