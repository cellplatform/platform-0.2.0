type KeyHandler = (e: KeyboardEvent) => any;

export const KeyListener = {
  keydown: listener('keydown'),
  keyup: listener('keyup'),
};

/**
 * Produces an event-binding factory for a keyboard event
 * that is "disposable" (remove event binding).
 */
function listener(event: 'keydown' | 'keyup') {
  return (handler: KeyHandler) => {
    document?.addEventListener(event, handler);
    return {
      dispose() {
        document?.removeEventListener(event, handler);
      },
    };
  };
}
