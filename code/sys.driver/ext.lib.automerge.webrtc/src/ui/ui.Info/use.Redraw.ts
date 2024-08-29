import { useEffect } from 'react';
import { PeerInfo, rx, useRedraw as useBase, type t } from './common';

/**
 * Manage redraw of the component.
 */
export function useRedraw(props: t.InfoProps) {
  const { network } = props;

  PeerInfo.useRedraw(network?.peer);
  const redraw = useBase();

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

  return redraw;
}
