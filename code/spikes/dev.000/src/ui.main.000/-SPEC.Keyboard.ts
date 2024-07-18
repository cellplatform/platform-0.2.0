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
    keys.on('META + KeyL', (e) => e.handled());

    return life;
  },
} as const;
