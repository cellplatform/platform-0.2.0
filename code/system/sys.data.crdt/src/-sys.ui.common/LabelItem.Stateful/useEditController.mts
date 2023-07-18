import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: edit behavior controller.
 */
export function useEditController(args: Args): t.LabelActionController {
  const { enabled = true, item } = args;

  const [ref, setRef] = useState<t.LabelItemRef>();
  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const change = (action: A, fn: t.LabelItemStateChanger) => {
    if (!enabled) return;
    if (item) {
      item.change(fn);
      fireChange(action);
    }
  };
  const fireChange = (action: A) => {
    const data = api.data;
    args.onChange?.({ action, data });
    increment();
  };

  const EditMode = {
    get isEditing() {
      return Boolean(item?.current.editing);
    },

    start() {
      if (EditMode.isEditing) return;
      change('edit:start', (draft) => (draft.editing = true));
    },

    accept() {
      if (!EditMode.isEditing) return;
      change('edit:accept', (draft) => (draft.editing = false));
    },

    cancel() {
      if (!EditMode.isEditing) return;
      change('edit:cancel', (draft) => (draft.editing = false));
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
      change('ready', (d) => null);
    },

    onChange(e) {
      change('data:label', (draft) => (draft.label = e.label));
      args.handlers?.onChange?.(e);
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
      if (EditMode.isEditing) return; // NB: Hack to reduce irrelevant focus/blur events.
      const action = e.focused ? 'view:focus' : 'view:blur';
      change(action, (d) => (d.focused = e.focused));
      args.handlers?.onFocusChange?.(e);
    },
  };

  /**
   * Reset when state instance changes.
   */
  useEffect(() => increment(), [item?.instance]);

  /**
   * Keyboard monitor.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const keyboard = Keyboard.until(dispose$);

    keyboard.on({
      Enter: (e) => EditMode.toggle(),
      Escape: (e) => EditMode.cancel(),
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, ref]);

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
