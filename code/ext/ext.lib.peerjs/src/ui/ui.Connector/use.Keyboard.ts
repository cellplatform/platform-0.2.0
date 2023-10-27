import { useEffect } from 'react';
import { DEFAULTS, Keyboard, LabelItem, type t } from './common';

/**
 * Keyboard controller.
 */
export function useKeyboard(args: {
  list?: t.LabelListState;
  behavior?: t.ConnectorPropsBehavior;
}) {
  const { list, behavior = {} } = args;
  const { grabFocusOnArrowKey = DEFAULTS.behavior.grabFocusOnArrowKey } = behavior;

  useEffect(() => {
    const keyboard = Keyboard.until();
    const commands = LabelItem.Model.List.commands(list);

    const focusAndSelect = () => {
      if (!list) return;
      if (!list.current.selected) commands.select(0);
      commands.focus();
    };

    keyboard.on({
      ArrowUp: (e) => focusAndSelect(),
      ArrowDown: (e) => focusAndSelect(),
    });

    if (!grabFocusOnArrowKey) keyboard.dispose();
    return keyboard.dispose;
  }, [grabFocusOnArrowKey, Boolean(list)]);
}
