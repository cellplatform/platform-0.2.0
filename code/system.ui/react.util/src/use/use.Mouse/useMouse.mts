import { type t } from '../common';
import { useState } from 'react';

/**
 * HOOK: keep track of mouse events for an HTML element
 * Usage:
 *
 *     const mouse = useMouse();
 *     <div {...mouse.handlers} />
 *
 */
export function useMouse(props: t.UseMouseProps = {}) {
  const [isDown, setDown] = useState(false);
  const [isOver, setOver] = useState(false);

  const down = (isDown: boolean) => (e: React.MouseEvent) => {
    setDown(isDown);
    if (isDown) props.onDown?.(e);
    if (!isDown) props.onUp?.(e);
  };
  const over = (isOver: boolean) => (e: React.MouseEvent) => {
    setOver(isOver);
    if (isOver === false) setDown(false);
    if (isOver) props.onEnter?.(e);
    if (!isOver) props.onLeave?.(e);
  };

  const onMouseDown = down(true);
  const onMouseUp = down(false);
  const onMouseEnter = over(true);
  const onMouseLeave = over(false);

  /**
   * API
   */
  return {
    is: { over: isOver, down: isDown },
    handlers: { onMouseDown, onMouseUp, onMouseEnter, onMouseLeave },
    reset() {
      setDown(false);
      setOver(false);
    },
  } as const;
}
