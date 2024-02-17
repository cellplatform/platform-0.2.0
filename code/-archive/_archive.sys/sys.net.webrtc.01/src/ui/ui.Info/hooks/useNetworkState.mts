import { useEffect, useState } from 'react';
import { rx, type t } from '../common';

/**
 * Turn the [NetworkDoc.current] into a React state.
 */
export function useNetworkState(ref?: t.NetworkDocSharedRef) {
  const [current, setCurrent] = useState<t.NetworkDocShared>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (ref) {
      ref.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => setCurrent(e.doc));
      setCurrent(ref.current);
    }
    return dispose;
  }, [ref?.id]);

  /**
   * API
   */
  return current;
}
