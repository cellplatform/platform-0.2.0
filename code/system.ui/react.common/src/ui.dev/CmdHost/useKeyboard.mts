import { useEffect, useState } from 'react';

import { t, Keyboard } from './common';

export function useKeyboard(textboxRef?: t.TextInputRef) {
  useEffect(() => {
    const handler = Keyboard.on('CMD + P', (e) => {
      e.cancel();
      textboxRef?.focus();
    });
    return () => handler.dispose();
  }, [textboxRef]);
}
