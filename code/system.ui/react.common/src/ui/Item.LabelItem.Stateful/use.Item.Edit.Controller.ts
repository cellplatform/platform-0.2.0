import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: edit behavior controller for a single <Item>.
 */
export function useItemEditController(args: Args) {
  const { item, enabled = true } = args;

  const [ref, setRef] = useState<t.LabelItemRef>();
  const [_, setCount] = useState(0);
  const increment = () => {
    setCount((prev) => prev + 1);
  };

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

  const EditMode = {
    get isEditing() {
      return Boolean(item?.current.editing);
    },

    start() {
      if (EditMode.isEditing) return;
      changeItem('edit:start', (draft) => (draft.editing = true));
    },

    accept() {
      if (!EditMode.isEditing) return;
      changeItem('edit:accept', (draft) => (draft.editing = false));
    },

    cancel() {
      if (!EditMode.isEditing) return;
      changeItem('edit:cancel', (draft) => (draft.editing = false));
    },

    toggle() {
      if (EditMode.isEditing) {
        EditMode.accept();
      } else {
        EditMode.start();
      }
    },
  };

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,

    onReady(e) {
      setRef(e.ref);
      args.handlers?.onReady?.(e);
      changeItem('ready', (d) => null);
    },

    onEditChange(e) {
      changeItem('data:label', (draft) => (draft.label = e.label));
      args.handlers?.onEditChange?.(e);
    },

    onLabelDoubleClick(e) {
      EditMode.start();
      args.handlers?.onLabelDoubleClick?.(e);
    },

    onEditClickAway(e) {
      EditMode.cancel();
      args.handlers?.onEditClickAway?.(e);
    },

    onFocusChange(e) {
      args.handlers?.onFocusChange?.(e);
    },
  };

  /**
   * Reset when state instance changes.
   */
  useEffect(() => increment(), [item?.instance]);

  /**
   * Keyboard.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const keyboard = Keyboard.until(dispose$);
    const isFocused = () => item?.current.focused ?? false;

    keyboard.on({
      Escape(e) {
        if (!isFocused()) return;
        EditMode.cancel();
      },
      Enter(e) {
        if (!isFocused()) return;
        EditMode.toggle();
      },
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, ref]);

  /**
   * API
   */
  const api: t.LabelItemController<'controller:Item.Edit'> = {
    kind: 'controller:Item.Edit',
    enabled,
    handlers,
    get data() {
      return item?.current ?? DEFAULTS.data.item;
    },
  };
  return api;
}
