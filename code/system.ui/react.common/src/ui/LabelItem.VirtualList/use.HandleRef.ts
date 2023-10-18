import { useRef } from 'react';
import { type VirtuosoHandle, type t } from './common';

/**
 * The programmatic API for the "virtual" (infinite) scrolling list.
 */
export function useHandle() {
  const ref = useRef<VirtuosoHandle>(null);

  const list: t.VirtualListHandle = {
    scrollTo(location, options = {}) {
      if (!ref.current) return;
      const { align = 'center', behavior = 'smooth', offset } = options;

      if (typeof location === 'number') {
        const index = location;
        ref.current.scrollToIndex({ index, align, behavior, offset });
      }

      if (location === 'Last') {
        const index = 'LAST';
        ref.current.scrollToIndex({ index, align, behavior, offset });
      }
    },
  };

  return {
    ready: Boolean(ref.current),
    ref,
    list,
  } as const;
}
