import { Keyboard, rx, type t } from './common';

export const CtrlKeyboard = {
  /**
   * Listen to the keyboard for events.
   */
  listen(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, dispose$?: t.UntilObservable) {
    const fireKeyboard = cmdbar.keyboard;
    const life = rx.lifecycle(dispose$);
    const keys = Keyboard.until(life.dispose$);
    const dbl = keys.dbl(150);

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
  },

  /**
   * Invoke the given keyboard action against the component.
   */
  handleKeyAction(cmdbar: t.CmdBarCtrl, action: t.KeyboardAction, isFocused?: boolean) {
    const name = action.name;

    if (name === 'Focus:CmdBar') {
      if (!isFocused) cmdbar.focus({ target: 'CmdBar' });
      if (isFocused) cmdbar.select({ scope: 'Expand' });
    }

    if (name === 'Focus:Main') {
      cmdbar.focus({ target: 'Main' });
    }
  },

  /**
   * Retrieve a new selection by moving back through spaces.
   */
  expandedSeletion(textbox: t.TextInputRef) {
    const { value, selection } = textbox.current;
    const index = wrangle.firstSpaceBeforeIndex(value, selection.start - 1);
    const start = index < 0 ? 0 : index + 1;
    const end = value.length;
    textbox.select(start, end);
  },

  /**
   * Toggle bewtween no selection (caret to end) and fully selected text.
   */
  toggleFullSelection(textbox: t.TextInputRef) {
    const { value, selection } = textbox.current;
    if (wrangle.isFullySelected(value, selection)) {
      const end = value.length;
      textbox.select(end, end);
    } else {
      textbox.selectAll();
    }
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  firstSpaceBeforeIndex(text: string, index: number): number {
    text = text.slice(0, index);
    for (let i = index - 1; i >= 0; i--) {
      if (text[i] === ' ') return i;
    }
    return -1;
  },

  isFullySelected(text: string, selection: t.TextInputSelection) {
    return selection.start === 0 && selection.end === text.length;
  },
} as const;
