import { useRef, RefObject, useEffect, useState } from 'react';
import { containsFocus, withinFocus } from './util.mjs';
import type { t } from '../common';

/**
 * Monitors focus state for an element,
 * and causes redraws when focus changes.
 */
export function useFocus<H extends HTMLElement>(
  input?: RefObject<H>,
  options: { redraw?: boolean } = {},
): t.FocusHook<H> {
  const _ref = useRef<H>(null);
  const ref = input || _ref;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const onChange = () => {
      if (options.redraw ?? true) redraw();
    };

    const el = ref.current;
    el?.addEventListener('focus', onChange);
    el?.addEventListener('blur', onChange);

    return () => {
      el?.removeEventListener('focus', onChange);
      el?.removeEventListener('blur', onChange);
    };
  }, [ref, options.redraw]);

  /**
   * API
   */
  return {
    ref,
    redraw,
    get containsFocus() {
      return containsFocus(ref);
    },
    get withinFocus() {
      return withinFocus(ref);
    },
  };
}
