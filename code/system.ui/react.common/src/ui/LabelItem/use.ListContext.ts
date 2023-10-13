import { RefObject, useContext, useEffect } from 'react';
import { ListContext } from './Context.List';
import { rx, type t } from './common';

export function useListContext(args: {
  id?: string;
  ref: RefObject<HTMLDivElement>;
  position: t.LabelItemPosition;
}) {
  const { id, ref, position } = args;
  const { index } = position;
  const ctx = useContext(ListContext);

  /**
   * Monitor events.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const events = ctx.events(dispose$);
    const focus = () => ref.current?.focus();
    const blur = () => ref.current?.blur();

    const is = {
      item(item: number | string) {
        return typeof item === 'number' ? item === index : item === id;
      },
      get selected() {
        return ctx.list.selected === id;
      },
    };

    /**
     * Selection.
     */
    events.cmd.select$.pipe(rx.filter((e) => is.item(e.item))).subscribe((e) => {
      ref.current?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      if (e.focus) focus();
    });

    /**
     * Focus.
     */
    events.cmd.focus$.pipe(rx.filter(() => is.selected)).subscribe(focus);
    events.cmd.blur$.pipe(rx.filter(() => is.selected)).subscribe(blur);

    return dispose;
  }, [index]);

  /**
   * API
   */
  return { ref, ctx } as const;
}
