import { useEffect, useState } from 'react';
import { Is, rx, type t } from './common';

/**
 * Causes a redraw on document updates.
 */
export function useRedrawOnChange(
  doc?: t.DocRef | t.UriString,
  options: { debounce?: t.Msecs } = {},
) {
  const { debounce = 100 } = options;
  const uri = Is.docRef(doc) ? doc.uri : undefined;

  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);

  useEffect(() => {
    const events = Is.docRef(doc) ? doc.events() : undefined;
    events?.changed$
      .pipe(rx.debounceTime(debounce), rx.observeOn(rx.animationFrameScheduler))
      .subscribe(redraw);
    return events?.dispose;
  }, [uri, debounce]);
}
