import { useRef, RefObject, useEffect, useState } from 'react';
import { containsFocus, withinFocus } from './util.mjs';
import type { t } from '../common';

export type FocusHandler = (e: FocusHandlerArgs) => void;
export type FocusHandlerArgs = { focus: boolean; blur: boolean };

/**
 * Monitors focus state for an element,
 * and causes redraws when focus changes.
 */
export function useFocus<H extends HTMLElement>(
  input?: RefObject<H>,
  options: { redraw?: boolean; onFocus?: FocusHandler } = {},
): t.FocusHook<H> {
  const _ref = useRef<H>(null);
  const ref = input || _ref;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const onChange = (focus: boolean) => {
      return () => {
        options.onFocus?.({ focus, blur: !focus });
        if (options.redraw ?? true) redraw();
      };
    };

    const onFocus = onChange(true);
    const onBlur = onChange(false);

    const el = ref.current;
    el?.addEventListener('focus', onFocus);
    el?.addEventListener('blur', onBlur);

    return () => {
      el?.removeEventListener('focus', onFocus);
      el?.removeEventListener('blur', onBlur);
    };
  }, [ref, options.redraw]);

  /**
   * API
   */
  return {
    ref,
    get containsFocus() {
      return containsFocus(ref);
    },
    get withinFocus() {
      return withinFocus(ref);
    },
  };
}
