import { useEffect } from 'react';
import { Keyboard, type t, Hash } from '../common';

/**
 * Manages keyboard shortcuts for the test runner.
 */
export function useKeyboard(args: { data: t.TestPropListData; enabled?: boolean }) {
  const { data, enabled = true } = args;
  const modules = data.modules ?? [];
  const keyboard = Wrangle.patterns(data);
  const hash = Wrangle.patternsHash(data);

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
      if (!enabled) return;
      const handler = Keyboard.on(pattern, fn);
      dispose.push(handler.dispose);
    };

    const select = (select: t.SpecsSelectionResetHandlerArgs['select']) => {
      const specs = data.specs ?? {};
      const modifiers = Wrangle.modifiers();
      specs.onReset?.({ modifiers, select });
    };

    /**
     * Run selected.
     */
    handle(keyboard.run, (e) => {
      e.handled();
      const modifiers = { ...Wrangle.modifiers(), meta: false };
      data.run?.onRunAll?.({ modifiers });
    });

    /**
     * Run all (force).
     */
    handle(keyboard.runAll, (e) => {
      e.handled();
      const modifiers = { ...Wrangle.modifiers(), meta: true };
      data.run?.onRunAll?.({ modifiers });
    });

    /**
     * Select all.
     */
    handle(keyboard.selectAll, (e) => {
      e.handled();
      select('all');
    });

    /**
     * Select none.
     */
    handle(keyboard.selectNone, (e) => {
      e.handled();
      select('none');
    });

    return () => dispose.forEach((dispose) => dispose());
  }, [hash, enabled, modules.length]);
}

/**
 * Helpers
 */
const Wrangle = {
  modifiers(): t.KeyboardModifierFlags {
    return { shift: false, ctrl: false, alt: false, meta: false };
  },

  patterns(data: t.TestPropListData) {
    const keyboard = data?.keyboard ?? {};
    return {
      run: Wrangle.pattern(keyboard.run),
      runAll: Wrangle.pattern(keyboard.runAll),
      selectAll: Wrangle.pattern(keyboard.selectAll),
      selectNone: Wrangle.pattern(keyboard.selectNone),
    };
  },

  pattern(input?: t.TestPropListKeyboardPattern) {
    return typeof input === 'function' ? input() : input;
  },

  patternsHash(data: t.TestPropListData) {
    const keyboard = Wrangle.patterns(data);
    const patterns = Object.entries(keyboard).map(([key, value]) => `${key}:${value}`);
    return Hash.sha1(patterns);
  },
};
