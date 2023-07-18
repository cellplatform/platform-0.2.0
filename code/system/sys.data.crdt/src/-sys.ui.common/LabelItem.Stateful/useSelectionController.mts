import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
};

/**
 * HOOK: selection behavior controller.
 */
export function useSelectionController(args: Args) {
  const { enabled = true, item } = args;

  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  // console.log('useSelectionController >> enabled:', enabled); // TEMP 🐷

  /**
   * View component events.
   */
  const handlers: t.LabelItemPropsHandlers = {
    ...args.handlers,
  };

  /**
   * API
   */
  const api = { enabled, handlers } as const;
  return api;
}
