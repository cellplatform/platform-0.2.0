import { useEffect } from 'react';
import { Keyboard, t } from './common';

type ArrowKey = 'Up' | 'Down';

/**
 * Keyboard shortcuts.
 */
export function useKeyboard(
  textboxRef?: t.TextInputRef,
  options: { onArrowKey?(e: { key: ArrowKey }): void } = {},
) {
  useEffect(() => {
    const arrowKey = (e: t.KeyMatchSubscriberHandlerArgs, key: ArrowKey) => {
      e.cancel();
      options.onArrowKey?.({ key });
    };

    const handler = Keyboard.on({
      'CMD + KeyK'(e) {
        e.cancel();
        textboxRef?.focus();
        textboxRef?.selectAll();
      },
      Escape(e) {
        textboxRef?.blur();
      },
      ArrowUp: (e) => arrowKey(e, 'Up'),
      ArrowDown: (e) => arrowKey(e, 'Down'),
    });

    return () => handler.dispose();
  }, [textboxRef]);
}
