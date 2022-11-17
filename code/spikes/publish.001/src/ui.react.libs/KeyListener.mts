type KeyHandler = (e: KeyboardEvent) => any;

export const KeyListener = {
  keydown: listener('keydown'),
  keyup: listener('keyup'),
};

/**
 * Helpers
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
