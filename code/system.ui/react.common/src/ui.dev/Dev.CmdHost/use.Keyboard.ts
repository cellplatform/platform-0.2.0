import { useEffect } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

export type ArrowKey = 'Up' | 'Down';
export type ArrowKeyHandler = (e: ArrowKeyHandlerArgs) => void;
export type ArrowKeyHandlerArgs = { key: ArrowKey; meta: boolean };

/**
 * Keyboard shortcuts.
 */
export function useKeyboard(
  textboxRef?: t.TextInputRef,
  options: {
    onArrowKey?: ArrowKeyHandler;
    onClear?: () => void;
    autoGrabFocus?: boolean;
  } = {},
) {
  const { autoGrabFocus = DEFAULTS.autoGrabFocus } = options;

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    const arrowKey = (e: t.KeyMatchSubscriberHandlerArgs, key: ArrowKey) => {
      e.handled();
      const meta = e.state.modifiers.meta;
      options.onArrowKey?.({ key, meta });
    };

    const handlers = Keyboard.on({
      ['ALT + KeyJ'](e) {
        e.handled();
        textboxRef?.focus();
        textboxRef?.selectAll();
      },

      ['Escape']: (e) => textboxRef?.blur(),
      ['CMD + KeyK']: (e) => options.onClear?.(),

      ['ArrowUp']: (e) => arrowKey(e, 'Up'),
      ['ArrowDown']: (e) => arrowKey(e, 'Down'),
      ['CMD + ArrowUp']: (e) => arrowKey(e, 'Up'),
      ['CMD + ArrowDown']: (e) => arrowKey(e, 'Down'),
    });

    const keypress = Keyboard.until(dispose$);
    keypress.down$
      .pipe(
        rx.filter(() => autoGrabFocus),
        rx.filter((e) => !!(e.last?.is.letter || e.last?.is.number)),
      )
      .subscribe((e) => textboxRef?.focus());

    return () => {
      handlers.dispose();
      dispose();
    };
  }, [textboxRef]);
}
