import { RefObject, useEffect, useRef, useState } from 'react';
import { t } from '../common/index.mjs';

type E = HTMLElement;

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
  const ready = Boolean(ref.current);

  const [rect, setRect] = useState<t.DomRect>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    let _dom$: ResizeObserver;

    if (ready && ref.current) {
      _dom$ = new ResizeObserver((entries) => {
        entries.forEach((entry) => setRect(entry.contentRect));
      });

      _dom$.observe(ref.current);
    }

    /**
     * Dispose
     */
    return () => _dom$?.disconnect();
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
