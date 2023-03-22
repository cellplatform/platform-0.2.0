import { useEffect, useRef } from 'react';
import type { t } from './common';

type T = Map<number, t.SpecListChildVisibility>;
type Percent = number; // 0..1

/**
 * Keep track of the visibility of visible list-items as they scroll.
 */
export function useScrollObserver(
  baseRef: React.RefObject<HTMLDivElement>,
  itemRefs: React.RefObject<HTMLLIElement>[],
  callback: t.SpecListChildVisibilityHandler | undefined,
  options: { threshold?: Percent | [Percent, Percent, Percent, Percent] } = {},
) {
  const mapRef = useRef<T>(new Map<number, t.SpecListChildVisibility>());

  useEffect(() => {
    let observer: IntersectionObserver;
    const root = baseRef.current;
    const rootMargin = '0px';
    const threshold = options.threshold ?? 0.5;

    const map = mapRef.current;
    map.clear();

    if (root) {
      const options = { root, rootMargin, threshold };
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLLIElement;
          const index = itemRefs.findIndex((ref) => ref.current === el);
          map.set(index, {
            index,
            isOnScreen: entry.isIntersecting,
            threshold,
          });
        });

        const items = toArray(mapRef);
        callback?.({ items });
      }, options);

      itemRefs.forEach((ref) => {
        if (ref.current) observer.observe(ref.current);
      });
    }

    return () => {
      map.clear();
      observer?.disconnect();
    };
  }, [itemRefs.length]);

  /**
   * API
   */
  return {
    length: itemRefs.length,
    get items() {
      return toArray(mapRef);
    },
  };
}

/**
 * [Helpers]
 */

function toArray(mapRef: React.MutableRefObject<T>) {
  return Array.from(mapRef.current.values());
}
