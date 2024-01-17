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
    const events = network?.events();
    if (network && events) {
      const redraw$ = rx.subject();
      redraw$.pipe(rx.debounceTime(30)).subscribe(redraw);
      events.peer.$.subscribe(() => redraw$.next());
      events.$.subscribe(() => redraw$.next());
    }
    return events?.dispose;
  }, [!!network]);

  return {} as const;
}
