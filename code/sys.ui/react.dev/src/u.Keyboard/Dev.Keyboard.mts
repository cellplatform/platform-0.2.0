import { DEFAULTS, Keyboard, type t } from '../common';

export const DevKeyboard = {
  DEFAULTS: {
    clearConsole: true,
    cancelSave: true,
    cancelPrint: true,
    newTab: true,
    copyAddress: true,
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
      copyAddress?: boolean;
      doubleEscapeDelay?: t.Msecs;
      onDoubleEscape?: (e: {}) => void;
      dispose$?: t.UntilObservable;
    } = {},
  ) {
    const DEFAULT = DevKeyboard.DEFAULTS;
    const qs = DEFAULTS.qs;
    const {
      clearConsole = DEFAULT.clearConsole,
      cancelSave = DEFAULT.cancelSave,
      cancelPrint = DEFAULT.cancelPrint,
      newTab = DEFAULT.newTab,
      copyAddress = DEFAULT.copyAddress,
    } = options;

    const openUrlTab = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

    const kbd = Keyboard.until(options.dispose$);
    const dbl = kbd.dbl();

    /**
     * Return to root index.
     */
    dbl.on('CMD + Escape', () => options.onDoubleEscape?.({}));

    /**
     * Clear debug console.
     */
    dbl.on('CMD + KeyK', () => {
      if (!clearConsole) return; // NB: not handled so other ['CMD+K' → clear] handlers will run.
      console.clear();
    });

    /**
     * ACTION: Cancel "save" HTML page (default browser action).
     */
    kbd.on('CMD + KeyS', (e) => {
      if (cancelSave) e.handled();
    });

    /**
     * ACTION: Cancel "print" HTML page (default browser action).
     */
    kbd.on('CMD + KeyP', (e) => {
      if (cancelPrint) e.handled();
    });

    /**
     * ACTION: new tab.
     */
    kbd.on('ALT + KeyT', (e) => {
      if (!newTab) return;
      e.handled();
      openUrlTab(location.href);
    });
    kbd.on('CTRL + ALT + KeyT', (e) => {
      if (!newTab) return;
      e.handled();
      const url = new URL(location.href);
      const params = url.searchParams;
      const namespace = params.get(qs.dev) ?? '';
      params.set(qs.dev, 'true');
      params.set(qs.selected, namespace);
      openUrlTab(url.href);
    });

    /**
     * Copy current harness address
     */
    kbd.on('CTRL + ALT + KeyC', (e) => {
      if (!copyAddress) return;
      e.handled();
      const url = new URL(location.href);
      const params = url.searchParams;
      if (params.get(qs.dev) !== 'true') {
        params.delete(qs.selected);
        params.delete(qs.filter);
      }
      navigator.clipboard.writeText(url.href);
      console.info(`copied: ${url.href}`);
    });

    // Finish up.
    return kbd;
  },
} as const;
