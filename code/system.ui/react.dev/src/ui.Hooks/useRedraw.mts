import { useEffect, useState } from 'react';
import { filter } from 'rxjs/operators';

import { DevBus, t } from './common';

type Id = string;

/**
 * Monitors the "redraw" event and causes a re-render when matched.
 */
export function useRedraw(instance: t.DevInstance, rendererIds: (Id | undefined)[]) {
  const ids = rendererIds.filter(Boolean) as Id[];
  const [count, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const events = DevBus.Events({ instance });
    const match$ = events.redraw.$.pipe(filter((e) => ids.some((id) => e.renderers.includes(id))));
    match$.subscribe(redraw);

    return () => events.dispose();
  }, [ids.join(',')]);

  return { ids };
}
