import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  item?: t.LabelItemState;
  enabled?: boolean;
  onChange?: t.LabelItemDataChangeHandler;
};

/**
 * HOOK: stateful behavior controller.
 */
export function useEditController(args: Args): t.LabelActionController {
  const { enabled = DEFAULTS.useEditController, item } = args;

  const [ref, setRef] = useState<t.LabelItemRef>();
  const [props, setProps] = useState<t.LabelItemProps>(DEFAULTS.props);
  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  /**
   * Handlers.
   */
  type A = t.LabelItemChangeAction;
  const change = (action: A, fn: t.LabelItemStateChanger) => {
    if (enabled && item) {
      item.change(fn);
      fireChange(action);
    }
  };
  const fireChange = (action: A) => {
    const data = api.data;
    args.onChange?.({ action, data });
    increment();
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
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    increment();
  }, [item?.instance.id]);

  /**
   * Keyboard monitor.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const keyboard = Keyboard.until(dispose$);

    keyboard.on({
      /**
       * [ENTER]: Toggle edit-mode.
       */
      Enter(e) {
        let next: boolean | undefined;
        setProps((prev) => {
          const editing = (next = !Boolean(prev.editing));
          return { ...props, editing };
        });
        fireChange(next ? 'prop:edit:start' : 'prop:edit:accept');
      },

      /**
       * [ESCAPE]: Cancel edit-mode.
       */
      Escape(e) {
        setProps((prev) => {
          if (prev.editing) fireChange('prop:edit:cancel');
          return { ...props, editing: false };
        });
      },
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
