import { RefObject, useEffect, useRef, useState } from 'react';

import { R, type t } from '../common';
import { ActiveElement } from './ActiveElement.mjs';
import { containsFocus, withinFocus, Wrangle } from './util.mjs';

/**
 * Monitors focus state for an element,
 * and causes redraws when focus changes.
 */
export function useFocus<H extends HTMLElement = HTMLDivElement>(
  input?: RefObject<H>,
  options: { redraw?: boolean; onFocus?: t.FocusHandler } = {},
): t.FocusHook<H> {
  const _ref = useRef<H>(null);
  const ref = input || _ref;

  const [, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const maybeRedraw = () => {
      if (options.redraw ?? true) increment();
    };

    let _last: t.FocusHandlerArgs | undefined;
    const onFocus = (focus: boolean) => {
      const args = Wrangle.args(focus);
      if (options.onFocus && !R.equals(args, _last)) options.onFocus(args);
      _last = args;
    };

    const changeHandler = (focus: boolean) => {
      return () => {
        onFocus(focus);
        maybeRedraw();
      };
    };
    const focusHandler = changeHandler(true);
    const blurHandler = changeHandler(false);

    const el = ref.current;
    el?.addEventListener('focus', focusHandler);
    el?.addEventListener('blur', blurHandler);
    const monitor = ActiveElement.listen((e) => {
      onFocus(e.focus);
      maybeRedraw();
    });

    return () => {
      el?.removeEventListener('focus', focusHandler);
      el?.removeEventListener('blur', blurHandler);
      monitor.dispose();
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
    get directlyFocused() {
      return containsFocus(ref) && withinFocus(ref);
    },
  };
}
