import { useEffect } from 'react';
import { DEFAULTS, Keyboard, type t } from './common';

/**
 * HOOK: Monitor keyboard input
 */
export function useKeyboard(props: {
  position: t.LabelItemPosition;
  selected?: boolean;
  focused?: boolean;
  editing?: boolean;
  onKeyDown?: t.LabelItemKeyHandler;
  onKeyUp?: t.LabelItemKeyHandler;
}) {
  const {
    position,
    focused = DEFAULTS.focused,
    selected = DEFAULTS.selected,
    editing = DEFAULTS.editing,
  } = props;

  useEffect(() => {
    const isActive = selected && focused && !editing;
    const fire = (e: KeyboardEvent, handler?: t.LabelItemKeyHandler) => {
      const { is, handled, code } = Keyboard.toKeypress(e);
      handler?.({ position, focused, selected, editing, is, code, handled });
    };

    const onKeydown = (e: KeyboardEvent) => fire(e, props.onKeyDown);
    const onKeyup = (e: KeyboardEvent) => fire(e, props.onKeyUp);
    if (isActive) {
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('keyup', onKeyup);
    }

    return () => {
      if (isActive) {
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('keydown', onKeyup);
      }
    };
  }, [selected, focused, editing]);
}
