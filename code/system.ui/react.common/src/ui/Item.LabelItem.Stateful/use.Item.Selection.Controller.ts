import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  ctx?: t.LabelItemListState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: selection behavior controller for a single <Item>.
 */
export function useItemSelectionController(args: Args) {
  const { ctx, item, enabled = true } = args;

  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
  const isEditing = () => Boolean(item?.current.editing);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const change = (action: A, fn: t.LabelItemStateNext) => {
    if (item && enabled) {
      item.change(fn);
      args.onChange?.({ action, data: api.data });
      increment();
    }
  };

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,

    onFocusChange(e) {
      if (isEditing()) return; // NB: Hack to reduce irrelevant focus/blur events.
      const action = e.focused ? 'view:focus' : 'view:blur';
      change(action, (d) => (d.focused = e.focused));
      args.handlers?.onFocusChange?.(e);
    },

    onClick(e) {
      /**
       * TODO 🐷
       */
      // change('view:selected', (d) => (d.selected = true));

      console.log('ctx', ctx);

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
      return item?.current ?? DEFAULTS.data;
    },
  };
  return api;
}
