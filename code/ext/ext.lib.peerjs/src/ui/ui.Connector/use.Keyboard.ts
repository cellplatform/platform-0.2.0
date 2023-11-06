import { useEffect } from 'react';
import { DEFAULTS, Keyboard, LabelItem, type t } from './common';

const b = DEFAULTS.behavior;

/**
 * Keyboard controller.
 */
export function useKeyboard(args: {
  list?: t.LabelListState;
  behavior?: t.ConnectorPropsBehavior;
}) {
  const { list, behavior = {} } = args;
  const { focusOnLoad = b.focusOnLoad, grabFocusOnArrowKey = b.grabFocusOnArrowKey } = behavior;

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

    /**
     * Initialize.
     */
    if (focusOnLoad) focusAndSelect();
    if (!grabFocusOnArrowKey) keyboard.dispose();
    return keyboard.dispose;
  }, [grabFocusOnArrowKey, focusOnLoad, Boolean(list)]);
}
