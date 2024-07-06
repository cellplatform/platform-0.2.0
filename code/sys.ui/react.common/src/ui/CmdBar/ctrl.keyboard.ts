import { Keyboard, rx, type t } from './common';

export const CtrlKeyboard = {
  /**
   * Listen to the keyboard for events.
   */
  listen(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, dispose$?: t.UntilObservable) {
    const fire = cmdbar.keyAction;
    const life = rx.lifecycle(dispose$);
    const keys = Keyboard.until(life.dispose$);
    const dbl = keys.dbl();
    const isFocused = () => textbox.current.focused;

    keys.on('Tab', (e) => {
      if (isFocused()) e.handled(); // NB: prevent unintended blur.
    });
    keys.on('META + KeyJ', () => {
      fire({ name: 'Focus:Main' });
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
   * Invoke the given keyboard action against the component.
   */
  action(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, action: t.CmdBarKeyAction) {
    const name = action.name;

    if (name === 'FocusAndSelect') {
      /**
       * TODO 🐷 selectively ← back select (split on positional args)
       *
       */
      console.log('TODO key action: progressive focus and select');

      cmdbar.focus({});
      cmdbar.caretToEnd({});
    }

    if (name === 'Focus:Main') {
      // NB: picked up by corresponding <Main> component.
    }

    if (name === 'Clear') {
      /**
       * TODO 🐷 clear text
       */
      console.log('TODO key action: clear');
    }
  },
} as const;
