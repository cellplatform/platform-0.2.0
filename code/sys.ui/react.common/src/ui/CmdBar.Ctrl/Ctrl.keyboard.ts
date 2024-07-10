import { Keyboard, rx, type t } from './common';

export const CtrlKeyboard = {
  /**
   * Listen to the keyboard for events.
   */
  listen(cmdbar: t.CmdBarCtrl, textbox: t.TextInputRef, dispose$?: t.UntilObservable) {
    const fire = cmdbar.keyboard;
    const life = rx.lifecycle(dispose$);
    const keys = Keyboard.until(life.dispose$);
    const dbl = keys.dbl(150);

    const isFocused = () => textbox.current.focused;
    const toggleFullSelection = () => {
      const { value, selection } = textbox.current;
      if (wrangle.isFullySelected(value, selection)) {
        const end = value.length;
        textbox.select(end, end);
      } else {
        textbox.selectAll();
      }
    };

    keys.on('Tab', (e) => {
      if (isFocused()) e.handled(); // NB: prevent unintended blur.
    });
    keys.on('META + KeyJ', (e) => {
      e.handled();
      fire({ name: 'Focus:Main' });
    });
    keys.on('META + KeyK', (e) => {
      e.handled();
      fire({ name: 'Focus:CmdBar' });
    });
    keys.on('META + SHIFT + KeyK', (e) => {
      e.handled();
      toggleFullSelection();
    });

    return life;
  },

  /**
   * Invoke the given keyboard action against the component.
   */
  action(cmdbar: t.CmdBarCtrl, action: t.KeyboardAction, isFocused?: boolean) {
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
  expandedSeletion(text: string, selection: t.TextInputSelection): t.TextInputSelection {
    const index = wrangle.firstSpaceBeforeIndex(text, selection.start - 1);
    const start = index < 0 ? 0 : index + 1;
    const end = text.length;
    return { start, end };
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
