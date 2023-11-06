import { Keyboard, rx, DEFAULTS } from '../common';

type Milliseconds = number;

export const DevKeyboard = {
  DEFAULTS: {
    clearConsole: true,
    cancelSave: true,
    cancelPrint: true,
    newTab: true,
    doubleEscapeDelay: 300,
  },

  /**
   * Common keyboard controller actions for the DEV harness environment.
   */
  listen(
    options: {
      clearConsole?: boolean;
      cancelSave?: boolean;
      cancelPrint?: boolean;
      newTab?: boolean;
      doubleEscapeDelay?: Milliseconds;
      onDoubleEscape?: (e: { delay: number }) => void;
    } = {},
  ) {
    const DEFAULT = DevKeyboard.DEFAULTS;
    const qs = DEFAULTS.qs;
    const {
      clearConsole = DEFAULT.clearConsole,
      cancelSave = DEFAULT.cancelSave,
      cancelPrint = DEFAULT.cancelPrint,
      newTab = DEFAULT.newTab,
      doubleEscapeDelay = DEFAULT.doubleEscapeDelay,
    } = options;

    const openUrlTab = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

    const keyboard = Keyboard.on({
      'CMD + Escape'(e) {
        escape$.next();
      },

      'CMD + KeyK'(e) {
        if (clearConsole) {
          e.handled();
          console.clear();
        }
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

      /**
       * ACTION: new tab.
       */
      'ALT + KeyT'(e) {
        if (!newTab) return;
        e.handled();
        openUrlTab(location.href);
      },

      'CTRL + ALT + KeyT'(e) {
        if (!newTab) return;
        e.handled();
        const url = new URL(location.href);
        const params = url.searchParams;
        const namespace = params.get(qs.dev) ?? '';
        params.set(qs.dev, 'true');
        params.set(qs.selected, namespace);
        openUrlTab(url.href);
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
