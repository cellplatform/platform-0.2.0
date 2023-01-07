import { useEffect, useState } from 'react';

import { Is, t } from './common';
import { useCurrentState } from './useCurrentState.mjs';
import { useRedrawEvent } from './useRedrawEvent.mjs';

type O = Record<string, unknown>;

export function useRenderer(instance: t.DevInstance, renderer?: t.DevRendererRef) {
  const id = renderer?.id ?? '';

  const [element, setElement] = useState<JSX.Element | null>(null);
  const current = useCurrentState(instance, { filter: (e) => e.message === 'state:write' });
  const redraw = useRedrawEvent(instance, [renderer]);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    let isDisposed = false;
    const state = current.info?.render.state ?? {};
    render(renderer, state).then((el) => {
      if (!isDisposed) setElement(el);
    });
    return () => {
      isDisposed = true;
    };
  }, [id, current.count, redraw.count]);

  /**
   * API.
   */
  return { element };
}

/**
 * Helpers
 */

async function render(renderer?: t.DevRendererRef, state?: O) {
  if (!renderer) return null;

  const id = renderer?.id ?? '';
  const res = renderer.fn({ id, state: state ?? {} });
  if (Is.promise(res)) await res;

  return (res as JSX.Element) ?? null;
}
