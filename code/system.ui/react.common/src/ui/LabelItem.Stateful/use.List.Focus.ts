import { useEffect } from 'react';
import { type t } from './common';

/**
 * HOOK: handles global management (and edge-cases) for list focus.
 */
export function useListFocusController<H extends HTMLElement = HTMLDivElement>(args: {
  ref: React.RefObject<H>;
  list: t.LabelListState;
}) {
  const { ref, list } = args;

  /**
   * Command: "redraw" (entire list).
   */
  useEffect(() => {
    const changer = (focused: boolean) => () => list.change((d) => (d.focused = focused));
    const handleFocus = changer(true);
    const handleBlur = changer(false);

    ref.current?.addEventListener('focusin', handleFocus);
    ref.current?.addEventListener('focusout', handleBlur);
    return () => {
      ref.current?.removeEventListener('focusin', handleFocus);
      ref.current?.removeEventListener('focusout', handleBlur);
    };
  }, [ref.current, list.instance]);
}
