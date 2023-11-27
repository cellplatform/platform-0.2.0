import { useEffect } from 'react';
import { Wrangle } from './Wrangle';
import { type t } from './common';

/**
 * HOOK: handles global management (and edge-cases) for list focus.
 */
export function useListFocusController<H extends HTMLElement = HTMLDivElement>(args: {
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
    const changer = (focused: boolean) => () => list.change((d) => (d.focused = focused));
    const focus = changer(true);
    const blur = changer(false);

    // Focus on load.
    if (Wrangle.enabled({ behaviors }, 'Focus.OnLoad')) focus();

    // Wire up events.
    ref.current?.addEventListener('focusin', focus);
    ref.current?.addEventListener('focusout', blur);

    return () => {
      // Un-wire events.
      ref.current?.removeEventListener('focusin', focus);
      ref.current?.removeEventListener('focusout', blur);
    };
  }, [ref.current, list.instance, behaviorsKinds]);

  /**
   * Ensure the "focus border" does not show for the container element.
   */
  useEffect(() => {
    const el = ref.current;
    if (el) el.style.outline = 'none';
  }, [ref.current, list.instance]);
}
