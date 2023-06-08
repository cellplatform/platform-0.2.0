import { useEffect } from 'react';
import { Keyboard, type t } from '../common';

/**
 * Manages keyboard shortcuts for the test runner.
 */
export function useKeyboard(args: { data: t.TestPropListData; enabled?: boolean }) {
  const { data, enabled = true } = args;
  const modules = (data.run ?? {}).modules ?? [];

  /**
   * Listen for keyboard events.
   */
  useEffect(() => {
    const pattern = Wrangle.keyTrigger(data) ?? '';
    const { dispose } = Keyboard.on(pattern, (e) => {
      /**
       * Run all/selected tests.
       */
      if (!enabled) return;
      if (!Wrangle.keyTrigger(data)) return;
      const modifiers = e.state.modifiers;
      data.run?.onRunAll?.({ modifiers });
    });

    return dispose;
  }, [enabled, modules.length]);
}

/**
 * Helpers
 */
const Wrangle = {
  keyTrigger(data: t.TestPropListData) {
    const value = data.run?.triggerKey;
    return typeof value === 'function' ? value() : value;
  },
};
