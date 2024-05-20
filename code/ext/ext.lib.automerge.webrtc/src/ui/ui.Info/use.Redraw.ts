import { useEffect } from 'react';
import { PeerInfo, rx, useRedraw as useBase, type t } from './common';

/**
 * Manage redraw of the component.
 */
export function useRedraw(props: t.InfoProps) {
  const { data = {} } = props;
  const { network } = data;

  PeerInfo.useRedraw(data);
  const redraw = useBase();

  useEffect(redraw, [props.stateful]);

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
