import { useState } from 'react';

/**
 * Monitor [isOver] and [isDown] state of an HTML element.
 */
export function useMouseState() {
  const [isDown, setDown] = useState(false);
  const down = (isDown: boolean) => () => setDown(isDown);

  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => {
    setOver(isOver);
    if (isOver === false) setDown(false);
  };

  const onMouseDown = () => down(true);
  const onMouseUp = () => down(false);
  const onMouseEnter = () => over(true);
  const onMouseLeave = () => over(false);

  /**
   * API
   */
  return {
    isOver,
    isDown,

    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,

    on: [onMouseDown, onMouseUp, onMouseEnter, onMouseLeave] as const,
  };
}
