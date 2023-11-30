import { useEffect } from 'react';
import { useReady } from '../use/use.Ready';
import { Wrangle } from './Wrangle';
import { Focus, Time, type t } from './common';

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
   * Monitor ready state.
   */
  const isReady = useReady(50, [ref.current, list.instance]);
  useEffect(() => {
    if (!isReady) return;
    if (Wrangle.enabled({ behaviors }, 'Focus.OnLoad')) {
      const focus = () => assignFocus(ref, list, true);
      Time.delay(50, focus);
    }
  }, [isReady]);

  /**
   * Command: "redraw" (entire list).
   */
  useEffect(() => {
    const changer = (focused: boolean) => () => {
      if (isReady) assignFocus(ref, list, focused);
    };
    const blur = changer(false);
    const focus = changer(true);

    // Wire up events.
    ref.current?.addEventListener('focusin', focus);
    ref.current?.addEventListener('focusout', blur);
    return () => {
      ref.current?.removeEventListener('focusin', focus);
      ref.current?.removeEventListener('focusout', blur);
    };
  }, [isReady, ref.current, list.instance, behaviorsKinds]);

  /**
   * Ensure the "focus border" does not show for the container element.
   */
  useEffect(() => {
    const el = ref.current;
    if (el) el.style.outline = 'none';
  }, [ref.current, list.instance]);
}

/**
 * Helpers
 */

function ensureDomFocused(ref: React.RefObject<HTMLElement>) {
  const el = ref.current;
  if (!Focus.containsFocus(ref)) el?.focus();
}

function assignFocus(ref: React.RefObject<HTMLElement>, list: t.LabelListState, focused: boolean) {
  list.change((d) => (d.focused = focused));
  if (focused) ensureDomFocused(ref);
}
