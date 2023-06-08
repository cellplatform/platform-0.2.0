import { useEffect } from 'react';
import { Keyboard, type t } from '../common';

/**
 * Manages keyboard shortcuts for the test runner.
 */
export function useKeyboard(args: { data: t.TestPropListData; enabled?: boolean }) {
  const { data, enabled = true } = args;
  const modules = (data.run ?? {}).modules ?? [];
  const keyboard = Wrangle.patterns(data);
  const patterns = Object.values(keyboard).join(',');

  /**
   * Listen for keyboard events.
   */
  useEffect(() => {
    type P = t.TestPropListKeyboardPattern | undefined;
    type F = t.KeyMatchSubscriberHandler;
    const dispose: (() => void)[] = [];

    const handle = (input: P, fn: F) => {
      const pattern = typeof input === 'function' ? input() : input;
      if (!pattern) return;
      const handler = Keyboard.on(pattern, (e) => (enabled ? fn(e) : null));
      dispose.push(handler.dispose);
    };

    /**
     * Run selected.
     */
    handle(keyboard.run, (e) => {
      const modifiers = { ...Wrangle.modifiers, meta: false };
      data.run?.onRunAll?.({ modifiers });
    });

    /**
     * Run all (force).
     */
    handle(keyboard.runAll, (e) => {
      const modifiers = { ...Wrangle.modifiers, meta: true };
      data.run?.onRunAll?.({ modifiers });
    });

    return () => dispose.forEach((dispose) => dispose());
  }, [enabled, modules.length, patterns]);
}

/**
 * Helpers
 */
const Wrangle = {
  patterns(data: t.TestPropListData) {
    const keyboard = data?.keyboard ?? {};
    return {
      run: Wrangle.pattern(keyboard.run),
      runAll: Wrangle.pattern(keyboard.runAll),
    };
  },

  pattern(input?: t.TestPropListKeyboardPattern) {
    return typeof input === 'function' ? input() : input;
  },

  get modifiers(): t.KeyboardModifierFlags {
    return { shift: false, ctrl: false, alt: false, meta: false };
  },
};
