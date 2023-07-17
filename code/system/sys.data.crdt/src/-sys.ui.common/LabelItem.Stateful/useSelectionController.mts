import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  item?: t.LabelItemState;
};

/**
 * HOOK: selection behavior controller.
 */
export function useSelectionController(args: Args) {
  const { enabled = true, item } = args;

  console.log('useSelectionController >> enabled:', enabled); // TEMP 🐷

  /**
   * API
   */
  const api = { enabled } as const;
  return api;
}
