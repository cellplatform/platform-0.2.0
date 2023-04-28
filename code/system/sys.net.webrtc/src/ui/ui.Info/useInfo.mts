import { useEffect, useState } from 'react';
import { rx, t } from './common';

export function useInfo(events?: t.WebRtcEvents) {
  const [info, setInfo] = useState<t.WebRtcInfo | undefined>(undefined);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    if (events) {
      const update = async () => setInfo(await events.info.get());
      const changed$ = events.connections.changed.$.pipe(rx.takeUntil(dispose$));
      changed$.pipe(rx.debounceTime(300)).subscribe(update);
      update();
    }

    return dispose;
  }, [events?.instance.id]);

  /**
   * API.
   */
  return info;
}
