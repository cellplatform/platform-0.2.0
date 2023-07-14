import { useEffect, useState, useRef } from 'react';

import { rx, type t, Keyboard, DEFAULTS } from './common';

/**
 * HOOK: stateful behavior controller.
 */
export function useController(args: { enabled?: boolean }) {
  const { enabled = DEFAULTS.useController } = args;

  const [props, setProps] = useState<t.LabelItemProps>(DEFAULTS.props);

  /**
   * Keyboard monitor.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    /**
     * TODO 🐷
     * - put an "on" method on the Keyboard.until() response.
     */
    const todo = Keyboard.until(dispose$);

    const keyboard = Keyboard.on({
      Enter(e) {
        if (!enabled) return;
        setProps((prev) => ({ ...prev, editing: !Boolean(prev.editing) }));
      },
    });

    return () => {
      keyboard.dispose();
      dispose();
    };
  }, [enabled]);

  /**
   * API
   */
  return { props } as const;
}
