import { useEffect } from 'react';
import { Keyboard, t } from './common';

export type ArrowKey = 'Up' | 'Down';
export type ArrowKeyHandler = (e: ArrowKeyHandlerArgs) => void;
export type ArrowKeyHandlerArgs = { key: ArrowKey; meta: boolean };

/**
 * Keyboard shortcuts.
 */
export function useKeyboard(
  textboxRef?: t.TextInputRef,
  options: { onArrowKey?: ArrowKeyHandler } = {},
) {
  useEffect(() => {
    const arrowKey = (e: t.KeyMatchSubscriberHandlerArgs, key: ArrowKey) => {
      e.handled();
      const meta = e.state.modifiers.meta;
      options.onArrowKey?.({ key, meta });
    };

    const handler = Keyboard.on({
      ['ALT + KeyJ'](e) {
        e.handled();
        textboxRef?.focus();
        textboxRef?.selectAll();
      },

      ['Escape']: (e) => textboxRef?.blur(),

      ['ArrowUp']: (e) => arrowKey(e, 'Up'),
      ['ArrowDown']: (e) => arrowKey(e, 'Down'),
      ['CMD + ArrowUp']: (e) => arrowKey(e, 'Up'),
      ['CMD + ArrowDown']: (e) => arrowKey(e, 'Down'),
    });

    return () => handler.dispose();
  }, [textboxRef]);
}
