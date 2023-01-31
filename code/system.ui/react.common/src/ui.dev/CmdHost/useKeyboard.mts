import { useEffect } from 'react';
import { Keyboard, t } from './common';

/**
 * Keyboard shortcuts.
 */
export function useKeyboard(textboxRef?: t.TextInputRef) {
  useEffect(() => {
    const handler = Keyboard.on({
      'CMD + KeyP'(e) {
        e.cancel();
        textboxRef?.focus();
        textboxRef?.selectAll();
      },
      Escape(e) {
        textboxRef?.blur();
      },
    });

    return () => handler.dispose();
  }, [textboxRef]);
}
