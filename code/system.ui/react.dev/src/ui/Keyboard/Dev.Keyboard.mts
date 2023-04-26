import { Keyboard, rx } from '../common';

type Milliseconds = number;

const DEFAULTS = {
  cancelSave: true,
  cancelPrint: true,
  doubleEscapeDelay: 300,
} as const;

export const DevKeyboard = {
  DEFAULTS,

  /**
   * Common keyboard controller actions for the DEV harness environment.
   */
  listen(
    options: {
      cancelSave?: boolean;
      cancelPrint?: boolean;
      doubleEscapeDelay?: Milliseconds;
      onDoubleEscape?: (e: { delay: number }) => void;
    } = {},
  ) {
    const {
      cancelSave = DEFAULTS.cancelSave,
      cancelPrint = DEFAULTS.cancelPrint,
      doubleEscapeDelay = DEFAULTS.doubleEscapeDelay,
    } = options;

    const keyboard = Keyboard.on({
      Escape(e) {
        escape$.next();
      },

      /**
       * ACTION: Cancel "save" HTML page (default browser action).
       */
      'CMD + KeyS'(e) {
        if (cancelSave) e.handled();
      },

      /**
       * ACTION: Cancel "print" HTML page (default browser action).
       */
      'CMD + KeyP'(e) {
        if (cancelPrint) e.handled();
      },
    });

    const { dispose$ } = keyboard;

    /**
     * Double-press event monitoring.
     */
    const escape$ = new rx.Subject<void>();
    const delay = doubleEscapeDelay;
    const doubleEscape$ = rx.withinTimeThreshold(escape$, delay, { dispose$ });
    doubleEscape$.$.subscribe((e) => options.onDoubleEscape?.({ delay }));

    /**
     * API
     */
    return keyboard;
  },
} as const;
