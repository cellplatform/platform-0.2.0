import { useEffect, useState } from 'react';
import { filter } from 'rxjs/operators';
import { DevBus, t } from './common';

type Id = string;

/**
 * Monitors the "redraw" event and causes a re-render when matched.
 */
export function useRedrawEvent(
  instance: t.DevInstance,
  renderers: (Id | t.DevRendererRef | t.DevRenderRef | undefined)[],
) {
  const ids = renderers
    .filter(Boolean)
    .map((item) => (typeof item === 'object' ? item.id : item) as Id);

  const [count, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = DevBus.Events({ instance });
    const hasRenderer = (renderers: Id[]) => ids.some((id) => renderers.includes(id));
    const match$ = events.redraw.$.pipe(filter((e) => e.all || hasRenderer(e.renderers)));
    match$.subscribe(redraw);
    return events.dispose;
  }, [ids.join(',')]);

  /**
   * API
   */
  return { count, ids } as const;
}
