import { t } from './common';

export const Util = {
  toModifierFlags(input: t.KeyboardModifierKeys): t.KeyboardModifierFlags {
    const flag = (value: t.KeyboardModifierEdges) => (value || []).length > 0;
    return {
      shift: flag(input.shift),
      alt: flag(input.alt),
      ctrl: flag(input.ctrl),
      meta: flag(input.meta),
    };
  },

  toFlags(e: KeyboardEvent): t.KeyboardKeyFlags {
    return {
      down: e.type === 'keydown',
      up: e.type === 'keyup',
      modifier: ['Shift', 'Alt', 'Control', 'Meta'].includes(e.key),
      number: e.code.startsWith('Digit') || e.code.startsWith('Numpad'),
      letter: e.code.startsWith('Key'),
      arrow: e.code.startsWith('Arrow'),
      enter: e.code === 'Enter',
      escape: e.code === 'Escape',
    };
  },

  toStateKey(e: t.KeyboardKeypress): t.KeyboardKey {
    const { is } = e;
    const { key, code } = e.keypress;
    return { key, code, is };
  },

  toKeypress(e: KeyboardEvent): t.KeyboardKeypress {
    const { key } = e;
    const name = e.type === 'keydown' ? 'onKeydown' : 'onKeyup';
    const stage = e.type === 'keydown' ? 'Down' : 'Up';

    return {
      name,
      key,
      stage,
      get keypress() {
        return Util.toKeypressProps(e);
      },
      get is() {
        return Util.toFlags(e);
      },
    };
  },

  toKeypressProps(e: KeyboardEvent): t.KeyboardKeypressProps {
    const { key, code, isComposing, location, repeat } = e;
    const { altKey, ctrlKey, metaKey, shiftKey } = e;
    const { bubbles, cancelable, eventPhase, timeStamp, isTrusted } = e;
    return {
      code,
      key,
      altKey,
      ctrlKey,
      metaKey,
      shiftKey,
      bubbles,
      cancelable,
      eventPhase,
      timeStamp,
      isTrusted,
      isComposing,
      location,
      repeat,
    };
  },
};
