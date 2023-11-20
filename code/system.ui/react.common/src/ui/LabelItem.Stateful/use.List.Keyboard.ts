import { useEffect } from 'react';
import { Wrangle } from './Wrangle';
import { Keyboard, Model, type t } from './common';

/**
 * HOOK: Keyboard listener for various common behaviors of the list.
 */
export function useListKeyboardController(args: {
  list: t.LabelListState;
  behaviors?: t.LabelItemBehaviorKind[];
}) {
  const { list, behaviors } = args;
  const behaviorsKinds = (behaviors || []).join();

  /**
   * Command: "redraw" (entire list).
   */
  useEffect(() => {
    const keyboard = Keyboard.until();
    const commands = Model.List.commands(list);

    const is = {
      focusOnLoad: Wrangle.enabled({ behaviors }, 'Focus.OnLoad'),
      focusOnArrowKey: Wrangle.enabled({ behaviors }, 'Focus.OnArrowKey'),
    };

    const focusAndSelect = () => {
      if (!list.current.selected) commands.select(0);
      commands.focus();
    };

    keyboard.on({
      ArrowUp: (e) => focusAndSelect(),
      ArrowDown: (e) => focusAndSelect(),
    });

    if (is.focusOnLoad) focusAndSelect();
    if (!is.focusOnArrowKey) keyboard.dispose(); // NB: release keyboard events if beheavior not enabled.

    return keyboard.dispose;
  }, [list?.instance, behaviorsKinds]);
}
