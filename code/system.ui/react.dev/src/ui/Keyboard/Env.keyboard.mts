import { KeyListener } from '../common';

export const KeyboardMonitor = {
  listen() {
    return KeyListener.keydown(async (e) => {
      const handled = () => e.preventDefault();

      // CMD+S:
      if (e.key === 's' && e.metaKey) {
        // ACTION: Cancel "save" HTML page (default browser action).
        handled();
      }

      // CMD+K:
      if (e.key === 'k' && e.metaKey) {
        // ACTION: Clear "developer-tools" console.
        console.clear();
      }
    });
  },
};
