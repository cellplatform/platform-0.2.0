import { useEffect, useState } from 'react';

import { DevBus } from '../logic.Bus';
import { Is, t } from './common';
import { useCurrentState } from './useCurrentState.mjs';
import { useRedrawEvent } from './useRedrawEvent.mjs';

export function useRenderer(instance: t.DevInstance, renderer?: t.DevRendererRef) {
  const id = renderer?.id ?? '';

  const [element, setElement] = useState<JSX.Element | null>(null);
  const current = useCurrentState(instance, { filter: (e) => e.message === 'state:write' });
  const redraw = useRedrawEvent(instance, [renderer]);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = DevBus.events(instance);
    render(events, renderer).then(async (el) => {
      if (!events.disposed) setElement(el);
    });
    return () => events.dispose();
  }, [id, current.count, redraw.count]);

  /**
   * API.
   */
  return { element };
}

/**
 * Helpers
 */

async function render(events: t.DevEvents, renderer?: t.DevRendererRef) {
  if (!renderer) return null;

  const id = renderer?.id ?? '';
  const state = (await events.info.get()).render.state ?? {};
  const res = renderer.fn({ id, state });
  if (Is.promise(res)) await res;

  return (res as JSX.Element) ?? null;
}
