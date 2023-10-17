import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { ListContext } from './Context.List';
import { rx, type t } from './common';

/**
 * Manages state monitoring when running within the
 * context of a containing list.
 */
export function useListContext(
  position: t.LabelItemPosition,
  options: { ref?: RefObject<HTMLDivElement>; id?: string } = {},
) {
  const { id } = options;
  const { index } = position;
  const ctx = useContext(ListContext);

  const _ref = useRef<HTMLDivElement>(null);
  const ref = options.ref || _ref;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Monitor events.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const list = ctx.events(dispose$);
    const focus = () => ref.current?.focus();
    const blur = () => ref.current?.blur();

    const is = {
      get selected() {
        return ctx.list.selected === id;
      },
      item(item: number | string) {
        return typeof item === 'number' ? item === index : item === id;
      },
    };

    /**
     * Selection
     */
    list.cmd.select$.pipe(rx.filter((e) => is.item(e.item))).subscribe((e) => {
      ref.current?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      if (e.focus) focus();
    });

    /**
     * Focus
     */
    list.cmd.focus$.pipe(rx.filter(() => is.selected)).subscribe(focus);
    list.cmd.blur$.pipe(rx.filter(() => is.selected)).subscribe(blur);

    /**
     * Redraw
     */
    list.cmd.redraw$
      .pipe(rx.filter((e) => e.item === undefined || is.item(e.item)))
      .subscribe(redraw);

    return dispose;
  }, [index]);

  /**
   * API
   */
  return { ref, ctx } as const;
}
