import { RefObject, useEffect, useRef, useState } from 'react';

import { R, type t } from '../common';
import { ActiveElement } from './ActiveElement.mjs';
import { Focus } from './Focus.mjs';
import { Wrangle } from './util.mjs';

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
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const maybeRedraw = () => {
      if (options.redraw ?? true) redraw();
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

    const listener = Focus.listen(ref, {
      onFocus: changeHandler(true),
      onBlur: changeHandler(false),
    });

    const monitor = ActiveElement.listen((e) => {
      onFocus(e.focus);
      maybeRedraw();
    });

    return () => {
      monitor.dispose();
      listener.dispose();
    };
  }, [ref, options.redraw]);

  /**
   * API
   */
  return {
    ref,
    get containsFocus() {
      return Focus.containsFocus(ref);
    },
    get withinFocus() {
      return Focus.withinFocus(ref);
    },
    get directlyFocused() {
      return Focus.containsFocus(ref) && Focus.withinFocus(ref);
    },
  } as const;
}
