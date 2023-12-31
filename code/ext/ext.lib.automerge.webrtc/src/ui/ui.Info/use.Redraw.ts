import { useEffect, useState } from 'react';
import { PeerInfo, rx, type t } from './common';

/**
 * Manage redraw of the component.
 */
export function useRedraw(data: t.InfoData) {
  const { network } = data;

  PeerInfo.useRedraw(data);
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const redraw$ = rx.subject();
    redraw$.pipe(rx.debounceTime(30)).subscribe(redraw);
    network?.peer.events(dispose$).$.subscribe(() => redraw$.next());
    network?.$.pipe(rx.takeUntil(dispose$)).subscribe(() => redraw$.next());
    return dispose;
  }, [!!network]);

  return {} as const;
}
