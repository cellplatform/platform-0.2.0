import { useEffect, useState } from 'react';
import { DEFAULTS, rx, type t } from './common';

type Args = {
  position: t.LabelItemPosition;
  enabled?: boolean;
  list?: t.LabelListState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangedHandler;
};

/**
 * HOOK: selection behavior controller for a single <Item>.
 */
export function useItemSelectionController(args: Args) {
  const { list, item, enabled = true, position } = args;
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Redraw on selection/focus change.
   */
  useEffect(() => {
    type T = t.PatchChange<t.LabelList>;
    const focusChanged = (prev: T, next: T) => prev.after.focused === next.after.focused;
    const selectionChanged = (prev: T, next: T) =>
      isSelected(prev.after) === isSelected(next.after);
    const isSelected = (list: t.LabelList) => list.selected === item?.instance;
    const events = list?.events();
    events?.$.pipe(rx.distinctWhile(focusChanged)).subscribe(redraw);
    events?.$.pipe(rx.distinctWhile(selectionChanged)).subscribe((e) => {
      const isSelected = e.after.selected === item?.instance;
      fire(isSelected ? 'selected' : 'unselected');
      redraw();
    });

    return events?.dispose;
  }, [Boolean(list), Boolean(item?.instance), item?.instance]);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const fire = (action: A) => args.onChange?.({ action, position, item: api.current });

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,
    onClick(e) {
      if (enabled) list?.change((d) => (d.selected = item?.instance));
      args.handlers?.onClick?.(e);
    },
  };

  /**
   * API
   */
  const api = {
    enabled,
    handlers,
    get current() {
      return item?.current ?? DEFAULTS.data.item;
    },
  };
  return api;
}
