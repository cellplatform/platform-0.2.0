import { Keyboard } from '../common';

export const DevKeyboard = {
  listen() {
    Keyboard.on({
      /**
       * ACTION: Cancel "save" HTML page (default browser action).
       */
      'CMD + KeyS': (e) => e.cancel(),

      /**
       * ACTION: Cancel "print" HTML page (default browser action).
       */
      'CMD + KeyP': (e) => e.cancel(),
    });
  },
};
