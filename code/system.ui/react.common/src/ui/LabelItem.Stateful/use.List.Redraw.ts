import { useEffect, useState } from 'react';
import { rx, type t } from './common';

/**
 * HOOK: trigger redraws on specific list-model state changes.
 */
export function useListRedrawController(list: t.LabelListState) {
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Command: "redraw" (entire list).
   */
  useEffect(() => {
    const events = list.events();
    const isNil = (value?: string | number) => value === undefined || value === -1;
    const redrawCommand$ = events.cmd.redraw$.pipe(rx.filter((e) => isNil(e.item)));
    const redraw$ = rx.merge(events.total$, redrawCommand$);
    redraw$.pipe(rx.throttleAnimationFrame()).subscribe(redraw);
    return events.dispose;
  }, []);
}
