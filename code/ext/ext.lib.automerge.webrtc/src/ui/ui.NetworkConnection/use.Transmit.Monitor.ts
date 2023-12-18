import { useEffect, useState } from 'react';
import { Time, type t } from './common';

export function useTransmitMonitor(bytes: number = 0, options: { msecs?: t.Msecs } = {}) {
  const { msecs = 1500 } = options;
  const [isTransmitting, setTransmitting] = useState(false);

  useEffect(() => {
    const timer = Time.delay(msecs, () => setTransmitting(false));
    if (bytes > 0) setTransmitting(true);
    return () => timer.cancel();
  }, [bytes, msecs]);

  return { isTransmitting } as const;
}
