import { useEffect, useRef } from 'react';
import { Keyboard, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  ctx?: t.LabelItemListState;
};

/**
 * HOOK: Selection behavior for a <List> of <Items>.
 */
export function useListNavigationController(args: Args) {
  const { enabled = true } = args;

  /**
   * TODO 🐷
   * - pass-through in args
   * - attach to "list container" div
   * - used for focusing
   */
  const listRef = useRef<HTMLDivElement>();

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
  }, [enabled, listRef]);

  /**
   * API
   */
  const api: t.LabelListController<'controller:List.Selection'> = {
    kind: 'controller:List.Selection',
    enabled,
    listRef,
  } as const;
  return api;
}
