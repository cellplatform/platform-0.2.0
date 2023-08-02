import { useEffect, useRef, useState } from 'react';
import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, useMouseState, type t } from './common';

type M = React.MouseEventHandler;
type Args = {
  enabled?: boolean;
  onChange?: t.SliderTrackChangeHandler;
};

/**
 * HOOK: hook-up and manage mouse events.
 */
export function useEventMonitor(args: Args = {}) {
  const { enabled = DEFAULTS.enabled, onChange } = args;
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => removeMovementEvents(); // Dispose.
  }, []);

  const removeMovementEvents = () => {
    const detach = document.removeEventListener;
    detach('mousemove', onMouseMove);
    detach('mouseup', removeMovementEvents);
    detach('selectstart', onSelectStart);
    setDragging(false);
  };

  const onDown: M = (e) => {
    if (!enabled || !ref.current) return;
    if (onChange) {
      // Start listening to mouse movement (drag-start).
      const attach = document.addEventListener;
      attach('mousemove', onMouseMove);
      attach('mouseup', removeMovementEvents);
      attach('selectstart', onSelectStart);

      // Fire event.
      const percent = Wrangle.elementToPercent(ref.current, e.clientX);
      onChange({ percent });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!enabled || !ref.current) return;
    setDragging(true);
    const percent = Wrangle.elementToPercent(ref.current, e.clientX);
    onChange?.({ percent });
  };

  const onSelectStart = (e: Event) => {
    // NB: Prevent content around the slider from being
    //     selected while thumb is dragging.
    e.preventDefault();
  };

  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouseState({ onDown });

  /**
   * API
   */
  return {
    ref,
    el: ref.current,
    enabled,
    pressed: mouse.is.down || dragging,
    dragging,
    handlers: mouse.handlers,
  } as const;
}
