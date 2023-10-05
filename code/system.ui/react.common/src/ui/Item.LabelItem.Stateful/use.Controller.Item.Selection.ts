import { useEffect, useState } from 'react';
import { DEFAULTS, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  item?: t.LabelItemState;
  list?: t.LabelItemListState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: selection behavior controller for a single <Item>.
 */
export function useItemSelectionController(args: Args) {
  const { list, item, enabled = true } = args;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Redraw on selection/focus change.
   */
  useEffect(() => {
    type T = t.PatchChange<t.LabelItemList>;
    const focusChange = (prev: T, next: T) => prev.to.focused === next.to.focused;
    const selectionChange = (prev: T, next: T) => isSelected(prev.to) === isSelected(next.to);
    const isSelected = (list: t.LabelItemList) => list.selected === item?.instance;
    const events = list?.events();
    events?.$.pipe(rx.distinctUntilChanged(focusChange)).subscribe(redraw);
    events?.$.pipe(rx.distinctUntilChanged(selectionChange)).subscribe(redraw);
    return events?.dispose;
  }, [Boolean(list), Boolean(item?.instance), item?.instance]);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const fire = (action: A) => args.onChange?.({ action, data: api.data });

  const select = () => {
    if (enabled && list) {
      list.change((d) => (d.selected = item?.instance));
      fire('view:selected');
    }
  };

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,
    onClick(e) {
      select();
      args.handlers?.onClick?.(e);
    },
  };

  /**
   * API
   */
  const api: t.LabelItemController<'controller:Item.Selection'> = {
    kind: 'controller:Item.Selection',
    enabled,
    handlers,
    get data() {
      return item?.current ?? DEFAULTS.data.item;
    },
  };
  return api;
}
