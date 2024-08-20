import { Keyboard, rx, type t } from './common';

export const DevKeyboard = {
  /**
   * Start the keyboard event handlers.
   */
  listen(state: t.Lens<t.Harness>, options: { dispose$?: t.UntilObservable } = {}) {
    const life = rx.lifecycle(options.dispose$);
    const keys = Keyboard.until(life.dispose$);

    keys.on('META + Backslash', (e) => {
      state.change((d) => {
        const visible = d.debugVisible ?? (d.debugVisible = true);
        d.debugVisible = !visible;
      });
    });

    // Suppress focus being removed from the document with [CMD + L].
    keys.on('CMD + KeyS', (e) => e.handled()); // ← save
    keys.on('CMD + KeyP', (e) => e.handled()); // ← print
    keys.on('CMD + ArrowLeft', (e) => e.handled()); // ← browser back
    keys.on('CMD + ArrowRight', (e) => e.handled()); // ← browser forward

    return life;
  },
} as const;
