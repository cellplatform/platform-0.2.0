import { Keyboard, rx, type t } from './common';

/**
 * Listen to the keyboard for events.
 */
export function listen(
  cmdbar: t.CmdBarCtrl,
  textbox: t.TextInputRef,
  dispose$?: t.UntilObservable,
) {
  const fireKeyboard = cmdbar.keyboard;
  const life = rx.lifecycle(dispose$);
  const keys = Keyboard.until(life.dispose$);

  const isFocused = () => textbox.current.focused;

  keys.on('Tab', (e) => {
    if (isFocused()) e.handled(); // NB: prevent unintended blur.
  });
  keys.on('META + SHIFT + KeyJ', (e) => {
    e.handled(); // Prevent default browser action.
    fireKeyboard({ name: 'Focus:Main' });
  });

  keys.on('META + KeyJ', (e) => {
    e.handled();
    fireKeyboard({ name: 'Focus:Main' });
  });
  keys.on('META + KeyK', (e) => {
    e.handled();
    if (!isFocused()) fireKeyboard({ name: 'Focus:CmdBar' });
    cmdbar.select({ scope: 'Expand' });
  });
  keys.on('META + SHIFT + KeyK', (e) => {
    e.handled();
    if (!isFocused()) fireKeyboard({ name: 'Focus:CmdBar' });
    cmdbar.select({ scope: 'Toggle:Full' });
  });

  return life;
}
