import { Keyboard, rx, type t } from './common';

export const CtrlKeyboard = {
  /**
   * Listen to the keyboard for events.
   */
  listen(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, dispose$?: t.UntilObservable) {
    const life = rx.lifecycle(dispose$);
    const keys = Keyboard.until(life.dispose$);
    const dbl = keys.dbl();
    const fire = cmdbar.keyAction;
    const isFocused = () => textbox.current.focused;

    keys.on('Tab', (e) => {
      if (isFocused()) e.handled(); // NB: prevent unintended blur.
    });
    keys.on('META + KeyJ', () => {
      fire({ name: 'FocusMain' });
    });
    keys.on('META + KeyK', () => {
      if (!isFocused()) fire({ name: 'FocusAndSelect' });
    });
    dbl.on('META + KeyK', () => {
      if (isFocused()) fire({ name: 'Clear' });
    });

    return life;
  },

  /**
   * Invoke a keyboard action.
   */
  action(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, action: t.CmdBarKeyAction) {
    const name = action.name;

    if (name === 'FocusAndSelect') {
      /**
       * TODO 🐷 selectively ← back select (split on positional args)
       *
       */

      cmdbar.focus({});
      cmdbar.caretToEnd({});
    }

    if (name === 'FocusMain') {
      /**
       * TODO 🐷 - publish blur so the "<Main>" component can be focused.
       */

      cmdbar.blur({}); // TEMP 🐷
      console.log('TODO', 'pass focus to main');
      // cmdbar.keyAction({ name: 'FocusAndSelect' });
    }

    if (name === 'Clear') {
      console.log('key clear');

      /**
       * TODO 🐷 clear text
       *
       */

      // const path = CmdBar.Path.default.text;
      // main.state.cmdbar.change((d) => Doc.Text.replace(d, path, ''));
    }
  },
} as const;
