import { useRef } from 'react';
import { DEFAULTS, useMouse, type t } from './common';
import { Wrangle } from './u';

type Args = {
  enabled?: boolean;
  onChange?: t.SliderChangeHandler;
};

/**
 * HOOK: hook-up and manage mouse events.
 */
export function useEventMonitor(args: Args = {}) {
  const { enabled = DEFAULTS.enabled, onChange } = args;

  const fireChange = (x: t.Pixels) => {
    if (!onChange || !enabled || !ref.current) return;
    const percent = Wrangle.elementToPercent(ref.current, x);
    onChange?.({ percent });
  };

  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouse({
    onDown: (e) => fireChange(e.clientX),
    onDrag: (e) => fireChange(e.client.x),
  });

  /**
   * API
   */
  const dragging = mouse.is.dragging;
  const pressed = mouse.is.down || dragging;
  return {
    ref,
    el: ref.current,
    enabled,
    pressed,
    dragging,
    handlers: mouse.handlers,
  } as const;
}
