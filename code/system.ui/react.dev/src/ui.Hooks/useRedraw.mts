import { useEffect, useState } from 'react';
import { filter } from 'rxjs/operators';

import { DevBus, t } from './common';

type Id = string;

/**
 * Monitors the "redraw" event and causes a re-render when matched.
 */
export function useRedraw(
  instance: t.DevInstance,
  renderers: (Id | t.DevRendererRef | t.DevRenderRef | undefined)[],
) {
  const ids = renderers
    .filter(Boolean)
    .map((item) => (typeof item === 'object' ? item.id : item) as Id);

  const [_, setCount] = useState(0);
  const forceRedraw = () => setCount((prev) => prev + 1);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = DevBus.Events({ instance });
    const match$ = events.redraw.$.pipe(filter((e) => ids.some((id) => e.renderers.includes(id))));
    match$.subscribe(forceRedraw);
    return () => events.dispose();
  }, [ids.join(',')]);

  /**
   * API
   */
  return { ids };
}
