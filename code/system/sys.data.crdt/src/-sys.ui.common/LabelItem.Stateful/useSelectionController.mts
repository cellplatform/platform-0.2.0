import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  ctx?: t.LabelItemListCtxState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: selection behavior controller.
 */
export function useSelectionController(args: Args) {
  const { ctx, item, onChange, enabled = true } = args;

  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
  const isEditing = () => Boolean(item?.current.editing);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const change = (action: A, fn: t.LabelItemStateChanger) => {
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
  };

  /**
   * API
   */
  const api: t.LabelActionController = {
    enabled,
    handlers,
    get data() {
      return item?.current ?? DEFAULTS.data;
    },
  };

  return api;
}
