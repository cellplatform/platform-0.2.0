import { useEffect, useState, useRef } from 'react';

import { type t, Keyboard, rx } from './common';

type Args = {
  enabled?: boolean;
  ctx?: t.LabelItemListCtxState;
};

/**
 * HOOK: Selection behavior for a <List> of <Items>.
 */
export function useListSelectionController(args: Args) {
  const { enabled = true } = args;

  /**
   * TODO 🐷
   * - pass-through in args
   * - attach to "list container" div
   * - used for focusing
   */
  const focusRef = useRef<HTMLDivElement>();

  /**
   * TODO 🐷
   */
  console.log('💦 useListSelectionController', args);

  /**
   * Keyboard.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const keyboard = Keyboard.until(dispose$);
    // const isFocused = () => item?.current.focused ?? false;

    console.log('keyboard', keyboard);

    keyboard.on({
      ArrowUp(e) {
        console.log('arrow up', e);
      },
      Escape(e) {
        // if (!isFocused()) return;
        // EditMode.cancel();
      },
      Enter(e) {
        // if (!isFocused()) return;
        // EditMode.toggle();
      },
    });

    if (!enabled) dispose();
    return dispose;
  }, [enabled, focusRef]);

  /**
   * API
   */
  const api: t.LabelListController<'controller:List.Selection'> = {
    kind: 'controller:List.Selection',
    enabled,
  } as const;
  return api;
}
