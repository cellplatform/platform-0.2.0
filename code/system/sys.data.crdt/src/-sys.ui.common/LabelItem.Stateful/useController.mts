import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  state?: t.LabelItemState;
  enabled?: boolean;
  onChange?: t.LabelItemDataChangeHandler;
};

/**
 * HOOK: stateful behavior controller.
 */
export function useController(args: Args) {
  const { enabled = DEFAULTS.useController, state } = args;

  const [ref, setRef] = useState<t.LabelItemRef>();
  const [props, setProps] = useState<t.LabelItemProps>(DEFAULTS.props);
  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  type A = t.LabelItemDataChangeHandlerArgs['action'];
  const change = (action: A, fn: t.LabelItemStateChanger) => {
    if (enabled && state) {
      state.change(fn);
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
  }, [state?.instance.id]);

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
        setProps((prev) => ({ ...props, editing: !Boolean(prev.editing) }));
        fireChange('prop:editing');
      },
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, ref]);

  /**
   * API
   */
  const api = {
    get data() {
      return state?.current ?? DEFAULTS.data;
    },
    props,
    handlers,
  } as const;

  return api;
}
