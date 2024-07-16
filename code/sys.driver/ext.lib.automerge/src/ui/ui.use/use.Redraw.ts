import { useEffect, useState } from 'react';
import { Is, rx, type t } from './common';

/**
 * Causes a redraw on document updates.
 */
export function useRedrawOnChange(doc?: t.Doc | t.UriString, options: { debounce?: t.Msecs } = {}) {
  const { debounce = 100 } = options;
  const uri = Is.doc(doc) ? doc.uri : undefined;

  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);

  useEffect(() => {
    const ref = Is.doc(doc) ? doc : undefined;
    Redraw.onChange(ref, redraw, { debounce });
  }, [uri, debounce]);
}

/**
 * Non hook version of the redraw monitor.
 */
export const Redraw = {
  onChange(doc?: t.Doc, redraw?: () => void, options: t.UseRedrawOnChangeOptions = {}) {
    const { debounce = 100 } = options;
    const life = rx.lifecycle();
    if (Is.doc(doc)) {
      const events = doc.events(life.dispose$);
      events?.changed$
        .pipe(rx.debounceTime(debounce), rx.observeOn(rx.animationFrameScheduler))
        .subscribe(redraw);
    }
    return life;
  },
} as const;
