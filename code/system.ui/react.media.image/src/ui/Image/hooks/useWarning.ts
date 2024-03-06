import { useEffect, useRef, useState } from 'react';
import { Util } from '../u';
import { rx, type t } from '../common';

/**
 * Hook to manage the transient display of a warning message.
 */
export function useWarning(props: t.ImageProps) {
  const msecs = Util.warningDelay(props.warning);

  const $ref = useRef(new rx.Subject<void>());
  const [content, setContent] = useState<string | JSX.Element>('');
  const [count, setCount] = useState(0);
  const changed = () => setCount((prev) => prev + 1);

  /**
   * Methods
   */
  const clear = () => write('');
  const write = (message: string) => {
    setContent((message || '').trim());
    changed();
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (content) $ref.current.next();
  }, [count, content, msecs]);

  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();
    const $ = $ref.current.pipe(rx.takeUntil(dispose$), rx.debounceTime(msecs));
    $.subscribe(clear);
    return dispose;
  }, []);

  /**
   * API
   */
  return { content, write, clear } as const;
}
