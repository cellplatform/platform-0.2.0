import { rx, type t } from './common';

type KeyHandler = (e: KeyboardEvent) => any;

export const KeyListener = {
  keydown: listener('keydown'),
  keyup: listener('keyup'),
  get isSupported() {
    return typeof document === 'object';
  },
} as const;

/**
 * Produces an event-binding factory for a keyboard event
 * that is "disposable" (remove event binding).
 */
function listener(event: 'keydown' | 'keyup') {
  return (handler: KeyHandler): t.KeyListenerHandle => {
    const disposable = rx.lifecycle();
    document?.addEventListener(event, handler);
    disposable.dispose$.subscribe(() => document?.removeEventListener(event, handler));
    return disposable;
  };
}
