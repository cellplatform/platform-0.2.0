import { useEffect } from 'react';
import { Wrangle } from './Wrangle';
import { Keyboard, Model, type t } from './common';

/**
 * HOOK: Keyboard listener for various common behaviors of the list.
 */
export function useListKeyboardController<H extends HTMLElement = HTMLDivElement>(args: {
  ref: React.RefObject<H>;
  list: t.LabelListState;
  behaviors?: t.LabelItemBehaviorKind[];
}) {
  const { ref, list, behaviors } = args;
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

    const focusAndSelect = (force = false) => {
      if (!force && focusedElsewhere(ref)) return;
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
  }, [list?.instance, behaviorsKinds, !!ref.current]);
}

/**
 * Helpers
 */
function focusedElsewhere(ref: React.RefObject<HTMLElement>) {
  const activeEl = document.activeElement;
  if (activeEl === null || activeEl === document.body) return false;
  if (activeEl) {
    if (ref.current && ref.current === activeEl) return false;
    if (ref.current?.contains(activeEl)) return false;
    return true;
  }
  return false;
}
