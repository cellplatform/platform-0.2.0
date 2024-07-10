import { Ctrl, rx, type t } from './common';

export const Ref = {
  /**
   * Ref factory.
   */
  create(args: {
    ctrl: t.CmdBarCtrl;
    paths: t.CmdBarPaths;
    textbox: t.TextInputRef;
    dispose$: t.Observable<any>;
  }): t.CmdBarRef {
    const { paths, ctrl, textbox, dispose$ } = args;
    const resolve = Ctrl.Path.resolver(paths);
    let _textboxEvents: t.TextInputEvents | undefined;

    const cmdbar: t.CmdBarRef = {
      ctrl,
      paths,
      resolve,
      dispose$,
      get current() {
        const { value: text, focused, selection } = textbox.current;
        return { text, focused, selection };
      },
      onChange(fn, dispose$) {
        const events = _textboxEvents || (_textboxEvents = textbox.events(dispose$));
        const life = rx.lifecycle(dispose$);
        const $ = events.$.pipe(
          rx.takeUntil(life.dispose$),
          rx.observeOn(rx.animationFrameScheduler),
        );
        $.subscribe(() => fn(cmdbar.current));
        return life;
      },
    };

    return cmdbar;
  },
} as const;
