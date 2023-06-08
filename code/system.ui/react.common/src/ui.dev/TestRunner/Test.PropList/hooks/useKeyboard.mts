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
    const { dispose } = Keyboard.on({
      /**
       * Run all/selected tests on ENTER.
       */
      Enter(e) {
        if (!enabled) return;
        if (!Wrangle.runOnEnter(data)) return;
        const modifiers = e.state.modifiers;
        data.run?.onRunAll?.({ modifiers });
      },
    });

    return dispose;
  }, [enabled, modules.length]);
}

/**
 * Helpers
 */
const Wrangle = {
  runOnEnter(data: t.TestPropListData) {
    const value = data.run?.runOnEnter;
    if (value === undefined) return false;
    return Boolean(typeof value === 'function' ? value() : value);
  },
};
