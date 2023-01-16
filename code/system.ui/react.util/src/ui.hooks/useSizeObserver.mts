import { RefObject, useEffect, useRef, useState } from 'react';
import { type t } from '../common';

type E = HTMLElement;

export const DEFAULT = {
  get RECT(): t.DomRect {
    return { x: -1, y: -1, width: -1, height: -1, top: -1, right: -1, bottom: -1, left: -1 };
  },
} as const;

type Args<T extends E> = { ref?: RefObject<T> };

/**
 * Monitor size of an HTML/DOM element.
 *
 * Ref:
 *    Standards API
 *    https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 *
 */
export function useSizeObserver<T extends E = HTMLDivElement>(args?: Args<T>) {
  const ref = args?.ref ?? useRef<T>(null);
  const ready = typeof ref.current === 'object';

  const [rect, setRect] = useState<t.DomRect>(DEFAULT.RECT);

  /**
   * Lifecycle
   */
  useEffect(() => {
    let $: ResizeObserver;

    if (ref.current) {
      $ = new ResizeObserver((entries) => {
        entries.forEach((entry) => setRect(entry.contentRect));
      });
      $.observe(ref.current);
    }

    /**
     * Dispose
     */
    return () => $?.disconnect();
  }, [ready]);

  /**
   * API
   */
  return {
    ref,
    ready,
    rect,
  };
}
