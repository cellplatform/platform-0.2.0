import { useEffect, useState } from 'react';
import { DevBus } from '../logic.Bus';
import { DEFAULTS, Is, type t } from './common';
import { useCurrentState } from './useCurrentState';
import { useRedrawEvent } from './useRedrawEvent';

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
    render(events, renderer).then((el) => {
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

  const { info } = await events.info.fire();
  if (!info) return null;

  const state = info.render.state ?? {};
  const size = info.render.props?.size ?? DEFAULTS.size;
  const res = renderer.fn({ id, state, size });
  if (Is.promise(res)) await res;

  return (res as JSX.Element) ?? null;
}
