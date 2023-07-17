import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  item?: t.LabelItemState;
  onChange?: t.LabelItemDataChangeHandler;
};

/**
 * HOOK: edit behavior controller.
 */
export function useEditController(args: Args): t.LabelActionController {
  const { enabled = true, item } = args;

  console.log('useEditController >> enabled:', enabled); // TEMP 🐷

  const [ref, setRef] = useState<t.LabelItemRef>();
  const [props, setProps] = useState<t.LabelItemProps>(DEFAULTS.props);
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
    start() {
      if (!enabled) return;
      setProps((prev) => {
        if (!prev.editing) fireChange('edit:start');
        return { ...props, editing: true };
      });
    },

    cancel() {
      if (!enabled) return;
      setProps((prev) => {
        if (prev.editing) fireChange('edit:cancel');
        return { ...props, editing: false };
      });
    },

    toggle() {
      if (!enabled) return;
      setProps((prev) => {
        const editing = !Boolean(prev.editing);
        fireChange(editing ? 'edit:start' : 'edit:accept');
        return { ...props, editing };
      });
    },
  };

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    onReady(e) {
      setRef(e.ref);
    },

    onChange(e) {
      change('data:label', (draft) => (draft.label = e.label));
    },

    onDoubleClick(e) {
      EditMode.start();
    },

    onEditClickAway(e) {
      EditMode.cancel();
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
    props,
    get data() {
      return item?.current ?? DEFAULTS.data;
    },
  };

  return api;
}
