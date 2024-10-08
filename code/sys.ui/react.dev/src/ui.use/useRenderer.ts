import { useEffect, useState } from 'react';
import { DevBus } from '../u.Bus';
import { DEFAULTS, Is, type t } from './common';
import { useCurrentState } from './useCurrentState';
import { useRedrawEvent } from './useRedrawEvent';

export function useRenderer(instance: t.DevInstance, renderer?: t.DevRendererRef) {
  const id = renderer?.id ?? '';

  const [element, setElement] = useState<t.RenderedResult>(null);
  const current = useCurrentState(instance, { filter: (e) => e.message === 'state:write' });
  const redraw = useRedrawEvent(instance, [renderer]);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = DevBus.events(instance);

    const update = async (res: t.RenderedResult | Promise<t.RenderedResult>) => {
      const el = Is.promise(res) ? await res : res;
      setElement(el);
    };

    events.info.fire().then(({ info }) => {
      if (!renderer || !info || events.disposed) return;
      update(render(info, renderer));
    });

    return events.dispose;
  }, [id, current.count, redraw.count, !!renderer]);

  /**
   * API
   */
  return { element } as const;
}

/**
 * Helpers
 */

function render(info: t.DevInfo, renderer: t.DevRendererRef) {
  const state = info.render.state ?? {};
  const size = info.render.props?.size ?? DEFAULTS.size;
  const id = renderer.id;
  const res = renderer.fn({ id, state, size });
  return res;
}
