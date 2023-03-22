import { useEffect } from 'react';
import { t, rx } from './common';

/**
 * Handle scrolling to a specific list-item
 * when the [scrollTo$] observable emits.
 */
export function useScrollController(
  baseRef: React.RefObject<HTMLDivElement>,
  itemRefs: React.RefObject<HTMLLIElement>[],
  scrollTo$?: t.Observable<t.SpecListScrollTarget>,
) {
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    let _isScrolling = false;
    const scrolling$ = new rx.Subject<void>();
    const onScroll = () => scrolling$.next();
    baseRef.current?.addEventListener('scroll', onScroll);

    const scrollComplete$ = scrolling$.pipe(rx.takeUntil(dispose$), rx.debounceTime(50));
    scrollComplete$.subscribe((e) => (_isScrolling = false));

    scrollTo$
      ?.pipe(
        rx.takeUntil(dispose$),
        rx.filter(() => !_isScrolling),
      )
      .subscribe((e) => {
        const el = itemRefs[e.index]?.current;
        if (el) {
          _isScrolling = true;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

    return () => {
      dispose();
      scrolling$.complete();
      baseRef.current?.removeEventListener('scroll', onScroll);
    };
  }, [Boolean(scrollTo$), itemRefs.length]);
}
