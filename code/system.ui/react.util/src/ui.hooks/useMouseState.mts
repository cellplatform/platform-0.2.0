import { useState } from 'react';

type M = (e: {}) => void;
type Args = {
  onDown?: M;
  onUp?: M;
  onEnter?: M;
  onLeave?: M;
};

/**
 * Monitor [isOver] and [isDown] state of an HTML element.
 */
export function useMouseState(args: Args = {}) {
  const [isDown, setDown] = useState(false);
  const [isOver, setOver] = useState(false);

  const down = (isDown: boolean) => () => {
    setDown(isDown);
    if (isDown) args.onDown?.({});
    if (!isDown) args.onUp?.({});
  };
  const over = (isOver: boolean) => () => {
    setOver(isOver);
    if (isOver === false) setDown(false);
    if (isOver) args.onEnter?.({});
    if (!isOver) args.onLeave?.({});
  };

  const onMouseDown = down(true);
  const onMouseUp = down(false);
  const onMouseEnter = over(true);
  const onMouseLeave = over(false);

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

    handlers: { onMouseDown, onMouseUp, onMouseEnter, onMouseLeave },

    reset() {
      setDown(false);
      setOver(false);
    },
  };
}
