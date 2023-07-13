import { useEffect, useState, useRef } from 'react';

import { rx, type t, Keyboard, DEFAULTS } from './common';

/**
 * HOOK: stateful behavior controller.
 */
export function useController(args: { enabled?: boolean }) {
  const { enabled = DEFAULTS.useController } = args;

  /**
   * Keyboard monitor.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const keypress$ = Keyboard.Monitor.$.pipe(
      rx.takeUntil(dispose$),
      rx.filter(() => enabled),
    );

    keypress$.subscribe((e) => {
      console.log('keypress:', e);
    });

    return dispose;
  }, [enabled]);

  /**
   * API
   */
  return {} as const;
}
