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
    const ref = Is.docRef(doc) ? doc : undefined;
    Redraw.onChange(ref, redraw, { debounce });
  }, [uri, debounce]);
}

/**
 * Non hook version of the redraw monitor.
 */
export const Redraw = {
  onChange(doc?: t.DocRef, redraw?: () => void, options: t.UseRedrawOnChangeOptions = {}) {
    const { debounce = 100 } = options;
    const life = rx.lifecycle();
    if (Is.docRef(doc)) {
      const events = doc.events(life.dispose$);
      events?.changed$
        .pipe(rx.debounceTime(debounce), rx.observeOn(rx.animationFrameScheduler))
        .subscribe(redraw);
    }
    return life;
  },
} as const;
