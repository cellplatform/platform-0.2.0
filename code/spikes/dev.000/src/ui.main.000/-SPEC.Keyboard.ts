import { Keyboard, rx, type t } from './common';

export const DevKeyboard = {
  listen(state: t.Lens<t.Harness>, options: { dispose$?: t.UntilObservable } = {}) {
    const life = rx.lifecycle(options.dispose$);
    const keys = Keyboard.until(life.dispose$);

    keys.on('META + Backslash', (e) => {
      state.change((d) => {
        const visible = d.debugVisible ?? (d.debugVisible = true);
        d.debugVisible = !visible;
      });
    });

    return life;
  },
} as const;
