import { Keyboard } from '../common';

export const DevKeyboard = {
  /**
   * Common keyboard controller actions for the DEV harness environment.
   */
  listen(options: { cancelSave?: boolean; cancelPrint?: boolean } = {}) {
    const { cancelSave = true, cancelPrint = true } = options;

    Keyboard.on({
      /**
       * ACTION: Cancel "save" HTML page (default browser action).
       */
      'CMD + KeyS'(e) {
        if (cancelSave) e.cancel();
      },

      /**
       * ACTION: Cancel "print" HTML page (default browser action).
       */
      'CMD + KeyP'(e) {
        if (cancelPrint) e.cancel();
      },
    });
  },
};
