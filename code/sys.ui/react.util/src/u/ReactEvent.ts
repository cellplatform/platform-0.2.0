import { type t } from './common';

/**
 * Helpers for working with React generated events
 */
export const ReactEvent = {
  modifiers(e: React.MouseEvent): t.KeyboardModifierFlags {
    return {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
  },
} as const;
