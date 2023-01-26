import { Keyboard } from '../common';

export const DevKeyboard = {
  listen() {
    /**
     * ACTION: Cancel "save" HTML page (default browser action).
     */
    Keyboard.on('CMD + S', (e) => e.cancel());

    /**
     * ACTION: Clear "developer-tools" console.
     */
    Keyboard.on('CMD + K', () => console.clear());
  },
};
