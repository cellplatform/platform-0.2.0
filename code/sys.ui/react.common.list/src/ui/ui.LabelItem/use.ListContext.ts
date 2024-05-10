import { RefObject, useContext, useEffect, useState } from 'react';
import { ListContext } from './Context.List';
import { DEFAULTS, rx, type t } from './common';

/**
 * Manages state monitoring when running within the
 * context of a containing list.
 */
export function useListContext(
  ref: RefObject<HTMLDivElement>,
  position: t.LabelItemPosition,
  options: { id?: string } = {},
) {
  const { id } = options;
  const { index } = position;
  const ctx = useContext(ListContext);

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
      const detail = DEFAULTS.syntheticMousedownDetail; // NB: hint to any consumers of the event that it is synthetic.
      const event = new MouseEvent('mousedown', { bubbles: true, detail });
      ref.current?.dispatchEvent(event);
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
