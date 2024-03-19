import { useEffect, useState } from 'react';
import { rx, type t } from './common';

/**
 * Causes a redraw on document updates.
 */
export function useRedrawOnChange(doc?: t.DocRef, options: { debounce?: t.Msecs } = {}) {
  const { debounce = 100 } = options;
  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);

  useEffect(() => {
    const events = doc?.events();
    events?.changed$
      .pipe(rx.debounceTime(debounce), rx.observeOn(rx.animationFrameScheduler))
      .subscribe(redraw);
    return events?.dispose;
  }, [doc?.uri, debounce]);
}
