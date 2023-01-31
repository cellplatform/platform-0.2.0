import type { t } from './common';

type KeyHandler = (e: KeyboardEvent) => any;

export const KeyListener = {
  keydown: listener('keydown'),
  keyup: listener('keyup'),
  get isSupported() {
    return typeof window === 'object';
  },
};

/**
 * Produces an event-binding factory for a keyboard event
 * that is "disposable" (remove event binding).
 */
function listener(event: 'keydown' | 'keyup') {
  return (handler: KeyHandler): t.KeyListenerHandle => {
    window?.addEventListener(event, handler);
    return {
      dispose() {
        window?.removeEventListener(event, handler);
      },
    };
  };
}
