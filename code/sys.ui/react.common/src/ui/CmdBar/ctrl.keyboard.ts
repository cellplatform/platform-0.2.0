import { Keyboard, rx, type t } from './common';

export const CtrlKeyboard = {
  /**
   * Listen to the keyboard for events.
   */
  listen(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, dispose$?: t.UntilObservable) {
    const fire = cmdbar.keyAction;
    const life = rx.lifecycle(dispose$);
    const keys = Keyboard.until(life.dispose$);
    const dbl = keys.dbl(150);
    const isFocused = () => textbox.current.focused;

    keys.on('Tab', (e) => {
      if (isFocused()) e.handled(); // NB: prevent unintended blur.
    });
    keys.on('META + KeyJ', () => {
      fire({ name: 'Focus:Main' });
    });
    keys.on('META + KeyK', () => {
      fire({ name: 'Focus:CmdBar' });
    });
    dbl.on('META + KeyK', () => {
      if (isFocused()) textbox.selectAll();
    });

    return life;
  },

  /**
   * Invoke the given keyboard action against the component.
   */
  action(cmdbar: t.CmdBarCtrl, action: t.CmdBarKeyAction, isFocused?: boolean) {
    const name = action.name;

    if (name === 'Focus:CmdBar') {
      if (!isFocused) cmdbar.focus({ target: 'CmdBar' });
      if (isFocused) cmdbar.select({ scope: 'Expand' });
    }

    if (name === 'Focus:Main') {
      cmdbar.focus({ target: 'Main' });
    }
  },
} as const;
