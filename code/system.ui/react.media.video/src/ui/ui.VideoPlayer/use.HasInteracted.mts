import { useEffect, useState } from 'react';

let _hasInteracted = false; // NB: global/singleton value.

/**
 * [Hook]: used to answer the question of whether
 * the user has interacted in any way with the DOM
 * thereby unblocking the "autoplay policy" allowing
 * <video> and <audio> elements to play.
 */
export function useHasInteracted() {
  const [flag, setFlag] = useState(_hasInteracted);

  useEffect(() => {
    const handler = () => {
      setFlag(true);
      Listen.detach(handler);
    };
    if (!_hasInteracted) Listen.attach(handler);
    return _hasInteracted ? undefined : () => Listen.detach(handler);
  }, []);

  return flag;
}

/**
 * Helpers
 */
const Listen = {
  handler() {
    _hasInteracted = true;
    Listen.detach();
  },

  attach(handler?: () => void) {
    if (typeof window !== 'object') return;
    const fn = handler ?? Listen.handler;
    window.addEventListener('mousedown', fn);
    window.addEventListener('keydown', fn);
  },

  detach(handler?: () => void) {
    if (typeof window !== 'object') return;
    const fn = handler ?? Listen.handler;
    window.removeEventListener('mousedown', fn);
    window.removeEventListener('keydown', fn);
  },
};

Listen.attach(); // NB: attach by default.
