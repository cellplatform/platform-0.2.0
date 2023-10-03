import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

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

  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
  const isEditing = () => Boolean(item?.current.editing);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const fire = (action: A) => args.onChange?.({ action, data: api.data });
  const changeItem = (action: A, fn: t.LabelItemStateNext) => {
    if (item && enabled) {
      item.change(fn);
      fire(action);
      increment();
    }
  };

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,

    onFocusChange(e) {
      // NB: [If] statement → Hack to reduce irrelevant focus/blur events.
      if (!isEditing()) {
        const action = e.focused ? 'view:focus' : 'view:blur';
        changeItem(action, (d) => (d.focused = e.focused));
      }
      args.handlers?.onFocusChange?.(e);
    },

    onClick(e) {
      if (enabled && list) {
        list.change((d) => (d.selected = item?.instance));
        fire('view:selected');
      }
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
